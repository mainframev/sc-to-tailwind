import { FileInfo, API } from "jscodeshift";
import postcss, { Rule } from "postcss";
import syntax from "postcss-styled";
import pxToRem from "postcss-pxtorem";
import prettier from "prettier";
import { getTailwindUtils } from "./mapper";
import { pxToRemPropList } from "./consts";

/* eslint-disable no-restricted-syntax */

const transform = (file: FileInfo, api: API) => {
  const { jscodeshift: j } = api;
  const root = j(file.source);
  const TaggedTemplateExpressions = root
    // find all styled-component literals
    .find(j.TaggedTemplateExpression, {
      tag: {
        object: {
          name: "styled",
        },
      },
    });

  for (const path of TaggedTemplateExpressions.paths()) {
    const { parentPath } = path;
    const { tag, quasi } = path.node;
    const { name: componentName } = parentPath.node.id;

    // only if it's MemberExpression, like styled.div / styled.span etc
    if (tag.type === "MemberExpression" && tag.property.type === "Identifier") {
      // get tag name (e.g div / span)
      const { name: tagName } = tag.property;

      if (quasi.type === "TemplateLiteral") {
        const [literal] = quasi.quasis;

        const { root: postCSSRoot } = postcss([
          syntax,
          pxToRem({
            propList: pxToRemPropList,
          }),
        ]).process(literal.value.raw, {
          from: undefined,
        });

        const classNames: string[] = [];

        // walk only declarations
        postCSSRoot.walkDecls(decl => {
          if (decl.parent && decl.parent.type === "rule") {
            const { selector } = decl.parent as Rule;
            const parsedSelectors = selector.replace(/&/g, "").split(" ");
            parsedSelectors.forEach(s => {
              classNames.push(`${s}:${getTailwindUtils(decl)}`);
            });
          } else {
            classNames.push(getTailwindUtils(decl));
          }
        });

        // find component  with the same name as the styled-component
        // and add className attribute to it
        // rename the component to the tag name
        root
          .find(j.JSXElement, {
            openingElement: {
              name: {
                name: componentName,
              },
            },
          })
          .forEach(p => {
            p.node.openingElement.name = j.jsxIdentifier(tagName);

            if (!p.node.openingElement.selfClosing && p.node.closingElement) {
              p.node.closingElement.name = j.jsxIdentifier(tagName);
            }

            p.node.openingElement.attributes?.push(
              j.jsxAttribute(
                j.jsxIdentifier("className"),
                j.stringLiteral(
                  [...new Set(classNames.filter(Boolean).join(" ").split(" "))].join(" "),
                ),
              ),
            );
          });
      }
    }

    // remove styled-component node after it's been processed
    j(parentPath).remove();
    // remove styled-components import
    root
      .find(j.ImportDeclaration, {
        source: {
          value: "styled-components",
        },
      })
      .remove();
  }

  return prettier.format(root.toSource(), {
    parser: "typescript",
    printWidth: 100,
    plugins: [require.resolve("prettier-plugin-tailwindcss")],
  });
};

export default transform;

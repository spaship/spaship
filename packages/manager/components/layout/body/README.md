# Body Component
The `Body` component is a simple wrapper component for SPAship Manager pages. It simply attaches the `Header` component on top of it's children nodes. `Body` takes in the same attribute set as the `Header` component and directly passes down these attributes to `Header` while rendering the children with a Body Container.

## Author
 Sayak Sarkar | <sayak.bugsmith@gmail.com> | [sayak.in](https://sayak.in)

## Atrributes

| Attribute | Required | Default Value | Type | Description |
|--|--|--|--|--|
| breadcrumbs | Optional | [Breadcrumb] | Array | Array of Breadcrumb metadata. `Breadcrumb` object definition: `{  title: <string>, path: <string> }` |
| buttons | Optional | [button] | Array | Array of Button metadata. `Button` object definition: `{  title: <string>, path: <string> }` |
| previous | Optional | N/A | String | String containing path of any previous route path to route to |
| settings | Optional | N/A | String | String containing path of the settings route path. |
| title | Optional | N/A | String | String containing page title. |

## Component Syntax Example

```jsx
    <Body
        breadcrumbs={[
            {title: "link1", path: "/link1"},
            {title: "link2", path: "/path2"}
            ]}
        buttons={[{title: "link", path: "/path"}]}
        previous={"/prev"}
        settings={"/settings"}
        title="test"
    >
        <div>Hello World</div>
    </Body>
```

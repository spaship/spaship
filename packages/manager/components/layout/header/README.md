# Header Component
Header component for SPAship Manager pages. Rendered by the `Body` component, the header component is used to render the page header section for each Body Area container.

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
    <Header
        breadcrumbs={[
            {title: "link1", path: "/link1"},
            {title: "link2", path: "/path2"}
            ]}
        buttons={[{title: "link", path: "/path"}]}
        previous={"/prev"}
        settings={"/settings"}
        title="test"
    />
```

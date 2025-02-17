# @0xsequence/react-hooks

React hooks to interface with Sequence services. 

Wrap your application with the `ReactHooksConfigProvider` to provide a config to the hooks.

```tsx
<ReactHooksConfigProvider value={{ projectAccessKey: 'your-project-access-key' }}>
  <App />
</ReactHooksConfigProvider>
```

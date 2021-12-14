```mermaid
graph TD
web/src --> pages;
pages --> home;
pages --> editor;

web/src --> ui/;

web/src --> services;

```

```mermaid
graph TD
pages --> ui
ui --> services
```
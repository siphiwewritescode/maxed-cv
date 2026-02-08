# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to content" [ref=e2]:
    - /url: "#main-content"
  - generic [ref=e6]:
    - generic [ref=e7]:
      - heading "Maxed-CV" [level=1] [ref=e8]
      - paragraph [ref=e9]: Sign in to your account
    - generic [ref=e10]: Internal server error
    - generic [ref=e11]:
      - generic [ref=e12]:
        - generic [ref=e13]: Email
        - textbox [ref=e14]: sipho@example.com
      - generic [ref=e15]:
        - generic [ref=e16]: Password
        - generic [ref=e17]:
          - textbox [ref=e18]: password123
          - button "Show password" [ref=e19] [cursor=pointer]: 👁️‍🗨️
      - generic [ref=e20]:
        - generic [ref=e21] [cursor=pointer]:
          - checkbox "Remember me" [ref=e22]
          - text: Remember me
        - link "Forgot password?" [ref=e23]:
          - /url: /reset-password
      - button "Sign in" [ref=e24] [cursor=pointer]
      - paragraph [ref=e25]:
        - text: Don't have an account?
        - link "Sign up" [ref=e26]:
          - /url: /signup
      - generic [ref=e29]: or continue with
      - generic [ref=e31]:
        - link "Google" [ref=e32] [cursor=pointer]:
          - /url: http://localhost:3001/auth/google
        - link "LinkedIn" [ref=e33] [cursor=pointer]:
          - /url: http://localhost:3001/auth/linkedin
  - alert [ref=e34]
```
# Page snapshot

```yaml
- generic [ref=e1]:
  - link "Skip to content" [ref=e2]:
    - /url: "#main-content"
  - generic [ref=e6]:
    - generic [ref=e7]:
      - heading "Maxed-CV" [level=1] [ref=e8]
      - paragraph [ref=e9]: Sign in to your account
    - generic [ref=e10]:
      - generic [ref=e11]:
        - generic [ref=e12]: Email
        - textbox [active] [ref=e13]
      - generic [ref=e14]:
        - generic [ref=e15]: Password
        - generic [ref=e16]:
          - textbox [ref=e17]: password123
          - button "Show password" [ref=e18] [cursor=pointer]: 👁️‍🗨️
      - generic [ref=e19]:
        - generic [ref=e20] [cursor=pointer]:
          - checkbox "Remember me" [ref=e21]
          - text: Remember me
        - link "Forgot password?" [ref=e22]:
          - /url: /reset-password
      - button "Sign in" [ref=e23] [cursor=pointer]
      - paragraph [ref=e24]:
        - text: Don't have an account?
        - link "Sign up" [ref=e25]:
          - /url: /signup
      - generic [ref=e28]: or continue with
      - generic [ref=e30]:
        - link "Google" [ref=e31] [cursor=pointer]:
          - /url: http://localhost:3001/auth/google
        - link "LinkedIn" [ref=e32] [cursor=pointer]:
          - /url: http://localhost:3001/auth/linkedin
  - alert [ref=e33]
```
# Page snapshot

```yaml
- generic [ref=e1]:
  - link "Skip to content" [ref=e2]:
    - /url: "#main-content"
  - generic [ref=e6]:
    - generic [ref=e7]:
      - heading "Maxed-CV" [level=1] [ref=e8]
      - paragraph [ref=e9]: Create your account
    - generic [ref=e10]:
      - generic [ref=e11]:
        - generic [ref=e12]:
          - generic [ref=e13]: First Name
          - textbox [active] [ref=e14]
        - generic [ref=e15]:
          - generic [ref=e16]: Last Name
          - textbox [ref=e17]: User
      - generic [ref=e18]:
        - generic [ref=e19]: Email
        - textbox [ref=e20]: sipho@example.com
      - generic [ref=e21]:
        - generic [ref=e22]: Password
        - generic [ref=e23]:
          - textbox [ref=e24]: password123
          - button "Show password" [ref=e25] [cursor=pointer]: 👁️‍🗨️
        - paragraph [ref=e26]: Minimum 8 characters
      - button "Create account" [ref=e27] [cursor=pointer]
      - paragraph [ref=e28]:
        - text: Already have an account?
        - link "Sign in" [ref=e29]:
          - /url: /login
      - generic [ref=e32]: or continue with
      - generic [ref=e34]:
        - link "Google" [ref=e35] [cursor=pointer]:
          - /url: http://localhost:3001/auth/google
        - link "LinkedIn" [ref=e36] [cursor=pointer]:
          - /url: http://localhost:3001/auth/linkedin
  - alert [ref=e37]
```
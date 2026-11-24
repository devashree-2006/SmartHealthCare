# Backend setup

Set `MONGO_URI` and `SESSION_SECRET` in the backend environment before starting the server.

Admin sign-in uses `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH`. Generate the password hash locally with the installed `bcryptjs` package:

```sh
node -e "require('bcryptjs').hash('choose-a-strong-password', 12).then(console.log)"
```

Put the resulting hash in the server environment as `ADMIN_PASSWORD_HASH`; keep the plain password and `.env` file out of source control. Admin sessions use the same HTTP-only session cookie as the Patient and Doctor portals. Admin management APIs reject requests without an Admin session.

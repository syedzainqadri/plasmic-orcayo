# Plasmic Admin Credentials

## Default Admin User
- **Email**: admin@admin.example.com
- **Password**: !53kr3tz!

## Your User
- **Email**: zain@wattlesol.com
- **Password**: !53kr3tz!

## JWT Authentication Token
To authenticate via query parameter, use the following JWT token:

**JWT Token**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMDM1MGIwYi1iZDRmLTRlYjYtYWNmMi04OGFjMjYxYTEwMzUiLCJlbWFpbCI6ImFkbWluQGFkbWluLmV4YW1wbGUuY29tIiwiZmlyc3ROYW1lIjoiUGxhc21pYyIsImxhc3ROYW1lIjoiQWRtaW4iLCJpYXQiOjE3NjIxNTg0ODMsImV4cCI6MTc2Mjc2MzI4M30.7rhmtp7a_S27LAMBxarIG1erACbZQvDN0O8x0CSXJIo`

**Usage**:
- Add to URL as query parameter: `http://localhost:3003?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMDM1MGIwYi1iZDRmLTRlYjYtYWNmMi04OGFjMjYxYTEwMzUiLCJlbWFpbCI6ImFkbWluQGFkbWluLmV4YW1wbGUuY29tIiwiZmlyc3ROYW1lIjoiUGxhc21pYyIsImxhc3ROYW1lIjoiQWRtaW4iLCJpYXQiOjE3NjIxNTg0ODMsImV4cCI6MTc2Mjc2MzI4M30.7rhmtp7a_S27LAMBxarIG1erACbZQvDN0O8x0CSXJIo`
- Or pass in Authorization header: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMDM1MGIwYi1iZDRmLTRlYjYtYWNmMi04OGFjMjYxYTEwMzUiLCJlbWFpbCI6ImFkbWluQGFkbWluLmV4YW1wbGUuY29tIiwiZmlyc3ROYW1lIjoiUGxhc21pYyIsImxhc3ROYW1lIjoiQWRtaW4iLCJpYXQiOjE3NjIxNTg0ODMsImV4cCI6MTc2Mjc2MzI4M30.7rhmtp7a_S27LAMBxarIG1erACbZQvDN0O8x0CSXJIo`

**Usage with Project ID** (redirects to project builder):
- With project ID: `http://localhost:3003?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMDM1MGIwYi1iZDRmLTRlYjYtYWNmMi04OGFjMjYxYTEwMzUiLCJlbWFpbCI6ImFkbWluQGFkbWluLmV4YW1wbGUuY29tIiwiZmlyc3ROYW1lIjoiUGxhc21pYyIsImxhc3ROYW1lIjoiQWRtaW4iLCJpYXQiOjE3NjIxNTg0ODMsImV4cCI6MTc2Mjc2MzI4M30.7rhmtp7a_S27LAMBxarIG1erACbZQvDN0O8x0CSXJIo&projectId=tH77ekFNugan8Yv3d3xJez`

> Note 1: These are development passwords and should be changed in production environments for security.
> 
> Note 2: The JWT token is signed with the default development key and expires in 7 days.
> 
> Note 3: This JWT token now contains a valid user ID that exists in the database and should successfully authenticate you into the application.
> 
> Note 4: When using the projectId parameter with the token, you will be redirected directly to the project builder page for that specific project.
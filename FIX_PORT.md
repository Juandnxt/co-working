# Fix Port 5000 Already in Use Error

## Problem
You're getting this error:
```
Error: listen EADDRINUSE: address already in use :::5000
```

This means another process is using port 5000.

## Solution 1: Kill the Process Using Port 5000 (Recommended)

1. Find the process ID (PID):
```powershell
netstat -ano | findstr :5000
```

2. Kill the process (replace 15484 with your actual PID):
```powershell
taskkill /PID 15484 /F
```

3. Try running your app again:
```powershell
npm run dev
```

## Solution 2: Use a Different Port

1. Update `package.json`:
```json
"scripts": {
  "dev": "next dev -p 3000",
  ...
}
```

2. Update your `.env` file (if you have any hardcoded URLs):
```
# Change any localhost:5000 references to localhost:3000
```

3. Run:
```powershell
npm run dev
```

The app will be available at `http://localhost:3000`

## Solution 3: Find What's Using the Port

To see what application is using port 5000:

```powershell
Get-NetTCPConnection -LocalPort 5000 | Select-Object -Property LocalPort, State, OwningProcess | Format-Table
```

Then check the process:
```powershell
Get-Process -Id 15484
```

This will show you what application is using the port so you can decide if you want to close it.


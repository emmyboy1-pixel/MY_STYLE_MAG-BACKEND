const generateEmail = (resetToken) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            text-align: center;
            padding: 20px;
        }
        .container {
            max-width: 500px;
            background: #fff;
            padding: 20px;
            margin: auto;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #333;
        }
        p {
            color: #666;
        }
        .code {
            font-size: 24px;
            font-weight: bold;
            background: #f8f8f8;
            display: inline-block;
            padding: 10px 20px;
            border-radius: 5px;
            margin-top: 20px;
            letter-spacing: 3px;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #999;
        }
    </style>
</head>
<body>

    <div class="container">
        <h2>Reset Your Password</h2>
        <p>Use the code below to reset your password. This code is valid for only 15 minutes.</p>
        <div class="code">${resetToken}</div>
        <p>If you didn't request this, please ignore this email.</p>
        <div class="footer">© 2025 Your Company. All rights reserved.</div>
    </div>

</body>
</html>
`;

export default generateEmail;

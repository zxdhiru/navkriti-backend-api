export const welcomeTemplate = (name: string, action_url: string) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333333;
        }
        .email-container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 8px;
            overflow: hidden;
        }
        .email-header {
            background-color: #4CAF50;
            padding: 20px;
            text-align: center;
            color: #ffffff;
            font-size: 24px;
            font-weight: bold;
        }
        .email-body {
            padding: 20px;
        }
        .email-body p {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 20px;
        }
        .email-button {
            text-align: center;
            margin: 20px 0;
        }
        .email-button a {
            background-color: #4CAF50;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 25px;
            font-size: 16px;
            border-radius: 5px;
        }
        .email-footer {
            background-color: #f1f1f1;
            text-align: center;
            padding: 10px;
            font-size: 14px;
            color: #666666;
        }
        .email-footer a {
            color: #4CAF50;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            Welcome to ZXDHIRU!
        </div>

        <!-- Body -->
        <div class="email-body">
            <p>Hi <strong>{${name}}</strong>,</p>
            <p>We’re thrilled to have you join our community! At <strong>ZXDHIRU</strong>, we’re committed to providing you with the best experience possible.</p>
            <p>Here’s what you can do next:</p>
            <ul>
                <li>Explore our features</li>
                <li>Connect with our support team</li>
                <li>Start using our platform</li>
            </ul>
            <p>Click the button below to get started:</p>
            <div class="email-button">
                <a href="{${action_url}}" target="_blank">Get Started</a>
            </div>
            <p>If you have any questions, feel free to reach out to us at <a href="mailto:support@example.com">support@example.com</a>.</p>
        </div>

        <!-- Footer -->
        <div class="email-footer">
            <p>Thank you for joining us!</p>
            <p>ZXDHIRU Team</p>
            <p>
                <a href="#">Terms of Service</a> | <a href="#">Privacy Policy</a>
            </p>
        </div>
    </div>
</body>
</html>
`
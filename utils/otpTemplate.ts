export const otpEmailTemplate = (otp : number) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <h1 style="color: #333333; margin: 0;">Your OTP Code</h1>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 10px 20px;">
              <p style="color: #666666; font-size: 16px; margin: 0;">
                Hi there! Use the OTP below to complete your verification process.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 0;">
              <div style="display: inline-block; padding: 15px 30px; font-size: 24px; font-weight: bold; background-color: #007BFF; color: #ffffff; border-radius: 4px;">
                ${otp}
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 10px 20px;">
              <p style="color: #666666; font-size: 14px; margin: 0;">
                This OTP is valid for 10 minutes. Please do not share it with anyone.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 0;">
              <p style="color: #aaaaaa; font-size: 12px; margin: 0;">
                If you did not request this, please ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

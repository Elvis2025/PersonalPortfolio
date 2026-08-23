import { createApp } from './app.js';
import { environment } from './config/environment.js';

const { app, origins, resendConfigured, gmailConfigured } = createApp();

app.listen(environment.port, () => {
  console.log(`Back-end running on port ${environment.port}`);
  console.log(`CORS allowed origins: ${origins.join(', ')}`);
  console.log(`Resend configured: ${resendConfigured ? 'YES' : 'NO'}`);
  console.log(`Gmail SMTP configured: ${gmailConfigured ? 'YES' : 'NO'}`);
});

const app = require('./server');

const port = process.env.PIRATEJAM_SERVER || 8888;
app.listen(port, () => {
  console.log('__________________________________________________');
  console.log('');
  console.log(`PirateJam Server now Running at localhost:${port}`);
  console.log('');
  console.log('');
  console.log('Version 0.1                     Michael Harrison');
  console.log('');
  console.log('__________________________________________________');
  console.log('\n\n');
});

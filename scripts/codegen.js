const { join, resolve }  = require('path');
const codegen = require('@cosmwasm/ts-codegen').default;

const contractsDir = resolve(join(__dirname, '/../schemas'));
const contracts = [
  {
    name: 'CwLotto',
    dir: join(contractsDir, 'cw-lotto')
  },
];

codegen({
  contracts,
  outPath: join(__dirname, '../codegen'),
  options: {
    bundle: {
      enabled: true,
      bundleFile: 'index.ts',
      scope: 'contracts'
    },
    types: {
      enabled: true
    },
    client: {
      enabled: true
    },
    // messageComposer: {
    //   enabled: false
    // },
    useContractsHooks: {
      enabled: true
    },
  }
}).then(() => {
  console.log('✨ all done!');
}).catch(e=>{
  console.error(e);
  process.exit(1)
});

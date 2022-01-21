# Hardhat IPFS
install plugin with `yarn add hardhat-ipfs` or `npm install hardhat-ipfs`

add following line on top of your `hardhat.config.ts`:

```ts
import 'hardhat-ipfs';
```

### Environment

```ts
HardhatRuntimeEnvironment.ipfs: {
    client: IPFSHTTPClient;
    addFolder: (path: string, pattern: string) => Promise<AddFolderResult[]>;
    hashCID: (content: any) => Promise<CID>;
    getData: (cid: string | CID) => Promise<string>;
}
```

### Config IPFS Instance
if you ignore this step your ipfs client will be defaulted to infura.io

```ts
const config: HardhatUserConfig = {
  ipfs: {
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https'
  }
}
```

### Usage
simple example using ipfs with hardhat

```ts
import { task } from 'hardhat/config'

task('ipfshash', 'Prints the list of accounts', async (taskArgs, hre) => {
  const data = `HASHING YOUR DATA`
  const cid = await hre.ipfs.hashCID(data)
  console.log(cid.toString())
})
```
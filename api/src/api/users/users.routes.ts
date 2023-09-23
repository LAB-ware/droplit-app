// @ts-nocheck
import express, { Router, Request, Response } from 'express';
import UserSchema from './users.model';
import DropperContract from '../../../build/contracts/Dropper.json';
import RegistryContract from '../../../build/contracts/ERC6551Registry.json';

import { getWeb3Provider } from '../../utils/web3provider';

const router: Router = express.Router();

// default values set for transactions
const GAS = '4712388';
const GAS_PRICE = '100000000000';
const DROPPER_CONTRACT_ADDDRESS = process.env.DEFAULT_CONTRACT_OWNER;

// Route to retrieve users
router.get('/', async (_req: Request, res: Response) => {
  const users = await UserSchema.find();
  res.send(users);
});

router.get('/:id/deploy', async (req: Request, res: Response) => {
  const web3 = getWeb3Provider();

  const user = await UserSchema.findById(req.params.id);
  console.log('user', user);

  new web3.eth.Contract(DropperContract.abi)
    .deploy({
      data: DropperContract.bytecode,
    })
    .send({
      from: user.wallet_address, // from their acc
      gas: GAS,
      gasPrice: GAS_PRICE,
    })
    .then((receipt) => {
      console.log('receipt', receipt);
    });
  res.send(200);
});

router.post('/drop/mint', async (req: Request, res: Response) => {
  console.log('unlock drop', req.body);

  const web3 = getWeb3Provider();

  const networkId = await web3.eth.net.getId();
  const dropContractAddress =
    DropperContract.networks[networkId as unknown as keyof Object][
      'address' as keyof Object
    ].toString();

  const dropNFT = new web3.eth.Contract(
    DropperContract.abi,
    dropContractAddress
  );

  dropNFT.methods
    .safeMint(req.body.walletAddress, req.body.dropMetadataUrl)
    .send({
      from: '0x2D21887978c3e239E489fA0De5ef07B799c0aF7d',
      gas: GAS,
      gasPrice: GAS_PRICE,
    })
    .on('transactionHash', (hash) => {
      console.log('hash', hash);
      res.send(200, hash);
    })
    .catch((err) => {
      console.log('err', err);
      res.send(400, err);
    });
});

router.post('/drop/tba', async (req: Request, res: Response) => {
  const web3 = getWeb3Provider();
  const networkId = await web3.eth.net.getId();
  const dropContractAddress =
    DropperContract.networks[networkId as unknown as keyof Object][
      'address' as keyof Object
    ].toString();

  const registry = new web3.eth.Contract(
    RegistryContract.abi,
    '0x2D21887978c3e239E489fA0De5ef07B799c0aF7d'
  );

  registry.methods
    .account(
      '0xd776137bC221bD167bAc522B23d01443b7850868',
      1,
      '0x07b9E50F1f091eA26b66ae891C765a35FA2135d9',
      2,
      0
    )
    .call({
      from: '0xbA64FB487CC067c175347F4223fe46c98914Ff9F',
      gas: GAS,
      gasPrice: GAS_PRICE,
    })
    .then((result) => {
      console.log('result', result);
      res.send(200, result);
    });
});

router.post('/drop/createTba', async (req: Request, res: Response) => {
  const web3 = getWeb3Provider();
  const networkId = await web3.eth.net.getId();
  const dropContractAddress =
    DropperContract.networks[networkId as unknown as keyof Object][
      'address' as keyof Object
    ].toString();

  const registry = new web3.eth.Contract(
    RegistryContract.abi,
    '0x2D21887978c3e239E489fA0De5ef07B799c0aF7d'
  );

  registry.methods
    .createAccount(
      '0xd776137bC221bD167bAc522B23d01443b7850868',
      1,
      '0x07b9E50F1f091eA26b66ae891C765a35FA2135d9',
      2,
      0,
      []
    )
    .call({
      from: '0xbA64FB487CC067c175347F4223fe46c98914Ff9F',
      gas: GAS,
      gasPrice: GAS_PRICE,
    })
    .then((result) => {
      console.log('result', result);
      res.send(200, result);
    });
});

router.post('/drop/deployTba', async (req: Request, res: Response) => {
  const web3 = getWeb3Provider();
  new web3.eth.Contract(
    DropperContract.abi,
    '0xb79915c1cc35dc2a4ada155bde986f8c3fcc62cb'
  )
    .deploy({
      data: RegistryContract.bytecode,
    })
    .send({
      from: '0xbA64FB487CC067c175347F4223fe46c98914Ff9F', // from their acc
      gas: GAS,
      gasPrice: GAS_PRICE,
    })
    .then((receipt) => {
      console.log('receipt', receipt);
    });
  res.send(200);
});
export default router;

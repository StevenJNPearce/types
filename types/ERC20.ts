/* GENERATED BY TYPECHAIN VER. 0.2.4 */
/* tslint:disable */

import { BigNumber } from 'bignumber.js';
import {
  TypeChainContract,
  promisify,
  ITxParams,
  IPayableTxParams,
  DeferredTransactionWrapper,
  DeferredEventWrapper
} from './typechain-runtime';

export class ERC20 extends TypeChainContract {
  public readonly rawWeb3Contract: any;

  public constructor(web3: any, address: string | BigNumber) {
    const abi = [
      {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [{ name: 'who', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: false,
        inputs: [{ name: 'to', type: 'address' }, { name: 'value', type: 'uint256' }],
        name: 'transfer',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: 'owner', type: 'address' },
          { indexed: true, name: 'spender', type: 'address' },
          { indexed: false, name: 'value', type: 'uint256' }
        ],
        name: 'Approval',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: 'from', type: 'address' },
          { indexed: true, name: 'to', type: 'address' },
          { indexed: false, name: 'value', type: 'uint256' }
        ],
        name: 'Transfer',
        type: 'event'
      },
      {
        constant: true,
        inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }],
        name: 'allowance',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          { name: 'from', type: 'address' },
          { name: 'to', type: 'address' },
          { name: 'value', type: 'uint256' }
        ],
        name: 'transferFrom',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [{ name: 'spender', type: 'address' }, { name: 'value', type: 'uint256' }],
        name: 'approve',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ];
    super(web3, address, abi);
  }

  static async createAndValidate(web3: any, address: string | BigNumber): Promise<ERC20> {
    const contract = new ERC20(web3, address);
    const code = await promisify(web3.eth.getCode, [address]);

    // in case of missing smartcontract, code can be equal to "0x0" or "0x" depending on exact web3 implementation
    // to cover all these cases we just check against the source code length — there won't be any meaningful EVM program in less then 3 chars
    if (code.length < 4) {
      throw new Error(`Contract at ${address} doesn't exist!`);
    }
    return contract;
  }

  public get totalSupply(): Promise<BigNumber> {
    return promisify(this.rawWeb3Contract.totalSupply, []);
  }
  public balanceOf(who: BigNumber | string): Promise<BigNumber> {
    return promisify(this.rawWeb3Contract.balanceOf, [who.toString()]);
  }
  public allowance(owner: BigNumber | string, spender: BigNumber | string): Promise<BigNumber> {
    return promisify(this.rawWeb3Contract.allowance, [owner.toString(), spender.toString()]);
  }

  public transferTx(
    to: BigNumber | string,
    value: BigNumber | number
  ): DeferredTransactionWrapper<ITxParams> {
    return new DeferredTransactionWrapper<ITxParams>(this, 'transfer', [
      to.toString(),
      value.toString()
    ]);
  }
  public transferFromTx(
    from: BigNumber | string,
    to: BigNumber | string,
    value: BigNumber | number
  ): DeferredTransactionWrapper<ITxParams> {
    return new DeferredTransactionWrapper<ITxParams>(this, 'transferFrom', [
      from.toString(),
      to.toString(),
      value.toString()
    ]);
  }
  public approveTx(
    spender: BigNumber | string,
    value: BigNumber | number
  ): DeferredTransactionWrapper<ITxParams> {
    return new DeferredTransactionWrapper<ITxParams>(this, 'approve', [
      spender.toString(),
      value.toString()
    ]);
  }

  public ApprovalEvent(eventFilter: {
    owner?: BigNumber | string | Array<BigNumber | string>;
    spender?: BigNumber | string | Array<BigNumber | string>;
  }): DeferredEventWrapper<
    { owner: BigNumber | string; spender: BigNumber | string; value: BigNumber | number },
    {
      owner?: BigNumber | string | Array<BigNumber | string>;
      spender?: BigNumber | string | Array<BigNumber | string>;
    }
  > {
    return new DeferredEventWrapper<
      { owner: BigNumber | string; spender: BigNumber | string; value: BigNumber | number },
      {
        owner?: BigNumber | string | Array<BigNumber | string>;
        spender?: BigNumber | string | Array<BigNumber | string>;
      }
    >(this, 'Approval', eventFilter);
  }
  public TransferEvent(eventFilter: {
    from?: BigNumber | string | Array<BigNumber | string>;
    to?: BigNumber | string | Array<BigNumber | string>;
  }): DeferredEventWrapper<
    { from: BigNumber | string; to: BigNumber | string; value: BigNumber | number },
    {
      from?: BigNumber | string | Array<BigNumber | string>;
      to?: BigNumber | string | Array<BigNumber | string>;
    }
  > {
    return new DeferredEventWrapper<
      { from: BigNumber | string; to: BigNumber | string; value: BigNumber | number },
      {
        from?: BigNumber | string | Array<BigNumber | string>;
        to?: BigNumber | string | Array<BigNumber | string>;
      }
    >(this, 'Transfer', eventFilter);
  }
}

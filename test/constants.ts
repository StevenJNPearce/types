import Web3, { ContractInstance } from 'web3';
import FakeProvider from 'web3-fake-provider';
import BigNumber from 'bignumber.js';

import {
  DeferredTransactionWrapper,
  ITxParams,
  TypeChainContract
} from '../types/typechain-runtime';

import { AbiDefinition } from '@0xproject/types';

/**
 * Provides a harness to test autogenerated contract types
 */
export class TestContract<T extends TypeChainContract> {
  private mockWeb3: Web3;
  private mockCustomWeb3: Web3;

  private mockWeb3Contract: ContractInstance;
  private mockCustomWeb3Contract: ContractInstance;

  constructor(contractName: string, private address: string, contractCode?: string) {
    this.mockWeb3 = new Web3(new FakeProvider());

    this.mockWeb3Contract = {
      address: address,
      abi: require(`../node_modules/market-solidity/build/contracts/${contractName}.json`)
    };

    spyOn(this.mockWeb3.eth, 'getCode').and.callFake(
      (addr: string, cb: (err: Error, code: string) => void) => {
        expect(addr).toEqual(address);
        cb(null, contractCode || '0x234');
      }
    );

    this.setupMockContract(this.mockWeb3, this.mockWeb3Contract);
  }

  /**
   * Creates the contract type for the specified class
   *
   * @param contractClass The contract type class
   */
  public async createContract(
    createMethod: (web3: any, address: string | BigNumber) => Promise<T>
  ) {
    return createMethod(this.mockWeb3, this.address);
  }

  /**
   * Mocks out a web3 method
   *
   * @param methodName The method to mock out
   * @param expectedOrError The expected error or return value
   * @param expectedArgs The expected arguments
   */
  public setupMethodSpy(methodName: keyof T, expectedOrError: Error | any, ...expectedArgs: any[]) {
    const expected = expectedOrError instanceof Error ? null : expectedOrError;
    const expectedError = expectedOrError instanceof Error ? expectedOrError : null;

    this.mockWeb3Contract[methodName] = this.createMethodSpy(expectedArgs, expected, expectedError);
  }

  /**
   * Mocks out a web3 getter method
   *
   * @param methodName The method to mock out
   * @param expected The expected return value
   */
  public setupGetterSpy(methodName: keyof T, expected: any) {
    this.mockWeb3Contract[methodName] = this.createMethodSpy([], expected);
  }

  /**
   * Mocks out a web3 transactional method
   *
   * @param methodName The method to mock out
   * @param txArgs The expected transaction args
   * @param expectedArgs The expected arguments
   */
  public setupTxMethodSpy(methodName: keyof T, txArgs?: ITxParams, ...expectedArgs: any[]) {
    const web3MethodName = methodName.slice(0, methodName.length - 2);
    const expectedData = '0x128782984';

    txArgs = txArgs || {
      from: '0x237893629'
    };

    this.mockWeb3Contract[web3MethodName] = {
      sendTransaction: this.createMethodSpy(expectedArgs.concat(txArgs)),
      getData: jasmine.createSpy().and.callFake((...args) => {
        for (let i = 0; i < expectedArgs.length; i++) {
          expect(args[i]).toEqual(expectedArgs[i].toString());
        }

        return expectedData;
      })
    };
  }

  /**
   * Tests the specified method and ensures the method returns the correct value
   *
   * @param methodName The method name
   * @param expectedOrError The expected error or return value
   */
  public async assertMethod<N>(method: Promise<N>, expectedOrError?: Error | N) {
    try {
      const result = await method;

      if (expectedOrError instanceof Error) {
        fail();
      } else {
        expect(result).toBe(expectedOrError);
      }
    } catch (e) {
      if (expectedOrError instanceof Error) {
        expect(e).toBe(expectedOrError);
      } else {
        fail();
      }
    }
  }

  /**
   * Tests the specified transactional method and ensures the method returns the correct value
   *
   * @param method A reference to the method to test
   * @param txArgs The transaction params
   * @param expected The expected return value
   */
  public async assertTxMethod(
    method: DeferredTransactionWrapper<ITxParams>,
    txArgs?: ITxParams,
    expected?: any
  ) {
    const txResult = await method.send(txArgs);
    expect(txResult).toBe(expected);

    const txResultCustomWeb3 = await method.send(txArgs, this.mockWeb3);
    expect(txResultCustomWeb3).toBe(expected);

    const expectedData = '0x128782984';
    const dataResult = await method.getData();
    expect(dataResult).toBe(expectedData);
  }

  /**
   * Sets up the web3 instance to return the specified contract instance when web3.eth.contract().at() is called
   *
   * @param web3 The web3 instance to spy on
   * @param web3Contract The web3 contract to return
   */
  private setupMockContract(web3: Web3, web3Contract: ContractInstance) {
    spyOn(web3.eth, 'contract')
      .and.callFake((abi: AbiDefinition[]) => {
        expect(abi).toEqual(web3Contract.abi);
      })
      .and.returnValue({
        at: addr => {
          expect(addr).toEqual(this.address);
          return web3Contract;
        }
      });
  }

  private createMethodSpy(expectedArgs: any[], expected?: any, error?: any) {
    return jasmine.createSpy().and.callFake((...args) => {
      for (let i = 0; i < expectedArgs.length; i++) {
        if (typeof expectedArgs[i] === 'number') {
          expect(args[i]).toEqual(expectedArgs[i].toString());
        } else {
          expect(args[i]).toEqual(expectedArgs[i]);
        }
      }

      const cb = args[args.length - 1];

      cb(error, expected);
    });
  }
}

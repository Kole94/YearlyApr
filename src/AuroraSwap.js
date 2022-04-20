import { ethers } from "ethers";
import { useEffect, useState } from "react";
import $ from "jquery";
const BRL_CHEF_ABI = [
  {
    type: "constructor",
    stateMutability: "nonpayable",
    inputs: [
      { type: "address", name: "_BRL", internalType: "contract BRLToken" },
      { type: "address", name: "_devaddr", internalType: "address" },
      { type: "address", name: "_feeAddress", internalType: "address" },
      { type: "uint256", name: "_BRLPerBlock", internalType: "uint256" },
      { type: "uint256", name: "_startBlock", internalType: "uint256" },
    ],
  },
  {
    type: "event",
    name: "Deposit",
    inputs: [
      {
        type: "address",
        name: "user",
        internalType: "address",
        indexed: true,
      },
      {
        type: "uint256",
        name: "pid",
        internalType: "uint256",
        indexed: true,
      },
      {
        type: "uint256",
        name: "amount",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "EmergencyWithdraw",
    inputs: [
      {
        type: "address",
        name: "user",
        internalType: "address",
        indexed: true,
      },
      {
        type: "uint256",
        name: "pid",
        internalType: "uint256",
        indexed: true,
      },
      {
        type: "uint256",
        name: "amount",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        type: "address",
        name: "previousOwner",
        internalType: "address",
        indexed: true,
      },
      {
        type: "address",
        name: "newOwner",
        internalType: "address",
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Withdraw",
    inputs: [
      {
        type: "address",
        name: "user",
        internalType: "address",
        indexed: true,
      },
      {
        type: "uint256",
        name: "pid",
        internalType: "uint256",
        indexed: true,
      },
      {
        type: "uint256",
        name: "amount",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "BONUS_MULTIPLIER",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "contract BRLToken" }],
    name: "BRL",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "BRLPerBlock",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "add",
    inputs: [
      { type: "uint256", name: "_allocPoint", internalType: "uint256" },
      { type: "address", name: "_lpToken", internalType: "contract IBEP20" },
      { type: "uint16", name: "_depositFeeBP", internalType: "uint16" },
      { type: "bool", name: "_withUpdate", internalType: "bool" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "deposit",
    inputs: [
      { type: "uint256", name: "_pid", internalType: "uint256" },
      { type: "uint256", name: "_amount", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "dev",
    inputs: [{ type: "address", name: "_devaddr", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "devaddr",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "emergencyWithdraw",
    inputs: [{ type: "uint256", name: "_pid", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "feeAddress",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "getMultiplier",
    inputs: [
      { type: "uint256", name: "_from", internalType: "uint256" },
      { type: "uint256", name: "_to", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "massUpdatePools",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "owner",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "pendingBRL",
    inputs: [
      { type: "uint256", name: "_pid", internalType: "uint256" },
      { type: "address", name: "_user", internalType: "address" },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      { type: "address", name: "lpToken", internalType: "contract IBEP20" },
      { type: "uint256", name: "allocPoint", internalType: "uint256" },
      { type: "uint256", name: "lastRewardBlock", internalType: "uint256" },
      { type: "uint256", name: "accBRLPerShare", internalType: "uint256" },
      { type: "uint16", name: "depositFeeBP", internalType: "uint16" },
    ],
    name: "poolInfo",
    inputs: [{ type: "uint256", name: "", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "poolLength",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "renounceOwnership",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "set",
    inputs: [
      { type: "uint256", name: "_pid", internalType: "uint256" },
      { type: "uint256", name: "_allocPoint", internalType: "uint256" },
      { type: "uint16", name: "_depositFeeBP", internalType: "uint16" },
      { type: "bool", name: "_withUpdate", internalType: "bool" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setFeeAddress",
    inputs: [{ type: "address", name: "_feeAddress", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "startBlock",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "totalAllocPoint",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "transferOwnership",
    inputs: [{ type: "address", name: "newOwner", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "updateEmissionRate",
    inputs: [
      { type: "uint256", name: "_BRLPerBlock", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "updatePool",
    inputs: [{ type: "uint256", name: "_pid", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      { type: "uint256", name: "amount", internalType: "uint256" },
      { type: "uint256", name: "rewardDebt", internalType: "uint256" },
    ],
    name: "userInfo",
    inputs: [
      { type: "uint256", name: "", internalType: "uint256" },
      { type: "address", name: "", internalType: "address" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "withdraw",
    inputs: [
      { type: "uint256", name: "_pid", internalType: "uint256" },
      { type: "uint256", name: "_amount", internalType: "uint256" },
    ],
  },
];

const AuroraTokens = [
  {
    id: "weth",
    symbol: "WETH",
    contract: "0x12c87331f086c3C926248f964f8702C0842Fd77F",
  },
  {
    id: "brl",
    symbol: "BRL",
    contract: "0xc57eCc341aE4df32442Cf80F34f41Dc1782fE067",
  },

  {
    id: "wrapped-near",
    symbol: "WNEAR",
    contract: "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
  },
  {
    id: "polaris-token",
    symbol: "PLRS",
    contract: "0xD93d770C123a419D4c48206F201Ed755dEa3037B",
  },
  {
    id: "terra-luna",
    symbol: "LUNA",
    contract: "0xC4bdd27c33ec7daa6fcfd8532ddB524Bf4038096",
  },
  {
    id: "frax",
    symbol: "FRAX",
    contract: "0xDA2585430fEf327aD8ee44Af8F1f989a2A91A3d2",
  },
  {
    id: "rose",
    symbol: "ROSE",
    contract: "0xdcd6d4e2b3e1d1e1e6fa8c21c8a323dcbecff970",
  },
  {
    id: "nearpad",
    symbol: "PAD",
    contract: "0x885f8CF6E45bdd3fdcDc644efdcd0AC93880c781",
  },
  {
    id: "usd-coin",
    symbol: "USDC",
    contract: "0xb12bfca5a55806aaf64e99521918a4bf0fc40802",
  },
  {
    id: "dai",
    symbol: "DAI",
    contract: "0xe3520349f477a5f6eb06107066048508498a291b",
  },
  {
    id: "dai",
    symbol: "DAI",
    contract: "0x53810e4c71bc89d39df76754c069680b26b20c3d",
  },
  {
    id: "terrausd",
    symbol: "UST",
    contract: "0x5ce9F0B6AFb36135b5ddBF11705cEB65E634A9dC",
  },
  {
    id: "mimatic",
    symbol: "MIMATIC",
    contract: "0xdFA46478F9e5EA86d57387849598dbFB2e964b02",
  },
  {
    id: "mimatic",
    symbol: "MIMATIC",
    contract: "0xdFA46478F9e5EA86d57387849598dbFB2e964b02",
  },
];

const UNI_ABI = [
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
      { indexed: true, internalType: "address", name: "to", type: "address" },
    ],
    name: "Burn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
    ],
    name: "Mint",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0In",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1In",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0Out",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1Out",
        type: "uint256",
      },
      { indexed: true, internalType: "address", name: "to", type: "address" },
    ],
    name: "Swap",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint112",
        name: "reserve0",
        type: "uint112",
      },
      {
        indexed: false,
        internalType: "uint112",
        name: "reserve1",
        type: "uint112",
      },
    ],
    name: "Sync",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    constant: true,
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "MINIMUM_LIQUIDITY",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "PERMIT_TYPEHASH",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "address", name: "to", type: "address" }],
    name: "burn",
    outputs: [
      { internalType: "uint256", name: "amount0", type: "uint256" },
      { internalType: "uint256", name: "amount1", type: "uint256" },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "factory",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getReserves",
    outputs: [
      { internalType: "uint112", name: "_reserve0", type: "uint112" },
      { internalType: "uint112", name: "_reserve1", type: "uint112" },
      { internalType: "uint32", name: "_blockTimestampLast", type: "uint32" },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "_token0", type: "address" },
      { internalType: "address", name: "_token1", type: "address" },
    ],
    name: "initialize",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "kLast",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "address", name: "to", type: "address" }],
    name: "mint",
    outputs: [{ internalType: "uint256", name: "liquidity", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "nonces",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "uint8", name: "v", type: "uint8" },
      { internalType: "bytes32", name: "r", type: "bytes32" },
      { internalType: "bytes32", name: "s", type: "bytes32" },
    ],
    name: "permit",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "price0CumulativeLast",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "price1CumulativeLast",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "address", name: "to", type: "address" }],
    name: "skim",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "uint256", name: "amount0Out", type: "uint256" },
      { internalType: "uint256", name: "amount1Out", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "swap",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "sync",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "token0",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "token1",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];
const AuroraSwap = () => {
  const [apr, setApr] = useState(0);
  useEffect(() => {
    getAuroraYearlyApr();
  }, []);
  function getParameterCaseInsensitive(object, key) {
    return object[
      Object.keys(object).find((k) => k.toLowerCase() === key.toLowerCase())
    ];
  }
  const lookUpPrices = async function (id_array) {
    const prices = {};
    for (const id_chunk of chunk(id_array, 50)) {
      let ids = id_chunk.join("%2C");
      // debugger
      let res = await $.ajax({
        url:
          "https://api.coingecko.com/api/v3/simple/price?ids=" +
          ids +
          "&vs_currencies=usd",
        type: "GET",
      });
      for (const [key, v] of Object.entries(res)) {
        if (v.usd) prices[key] = v;
      }
    }
    return prices;
  };

  async function getAuroraPrices() {
    const idPrices = await lookUpPrices(AuroraTokens.map((x) => x.id));
    const prices = {};
    for (const bt of AuroraTokens)
      if (idPrices[bt.id]) prices[bt.contract] = idPrices[bt.id];
    return prices;
  }
  const getAuroraYearlyApr = async () => {
    const MAIN_Address = "0x35CC71888DBb9FfB777337324a4A60fdBAA19DDE";
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    try {
      await provider.send("eth_requestAccounts", []);
    } catch {}

    const daiContract = new ethers.Contract(
      MAIN_Address,
      BRL_CHEF_ABI,
      provider
    );
    const poolWETHInfo = await daiContract.poolInfo(1);

    const currentBlock = await provider.getBlockNumber();

    const totalAllocPoints = parseInt(await daiContract.totalAllocPoint(), 10);
    const multiplier = await daiContract.getMultiplier(
      currentBlock,
      currentBlock + 1
    );
    const rewardsPerWeek =
      (((await daiContract.BRLPerBlock()) / 1e18) * multiplier * 604800) / 1.1;

    let prices = await getAuroraPrices();
    const poolWETH = new ethers.Contract(
      poolWETHInfo.lpToken,
      UNI_ABI,
      provider
    );
    let staked = await poolWETH.balanceOf(MAIN_Address);

    let decimals = await poolWETH.decimals();
    let stakedCount = staked / 10 ** decimals;
    let allocPoi = poolWETHInfo.allocPoi;

    var poolRewardsPerWeek = (allocPoi / totalAllocPoints) * rewardsPerWeek;

    const rewardTokenAddress = await daiContract.callStatic["BRL"]();
    const rewardPrice = getParameterCaseInsensitive(
      prices,
      rewardTokenAddress
    )?.usd;
    var staked_tvl = stakedCount * rewardPrice;
    var usdPerWeek = poolRewardsPerWeek * rewardPrice;
    var weeklyAPR = (usdPerWeek / staked_tvl) * 100;
    var yearlyAPR = weeklyAPR * 52;

    setApr(yearlyAPR);
  };
  const chunk = (arr, n) =>
    arr.length ? [arr.slice(0, n), ...chunk(arr.slice(n), n)] : [];

  return (
    <div id="log">
      <p>{apr}</p>
    </div>
  );
};
export default AuroraSwap;

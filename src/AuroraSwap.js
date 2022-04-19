import { ethers } from "ethers";

const AuroraSwap = () => {
  async function getAuroraPrices() {
    const idPrices = await lookUpPrices(AuroraTokens.map((x) => x.id));
    const prices = {};
    for (const bt of AuroraTokens)
      if (idPrices[bt.id]) prices[bt.contract] = idPrices[bt.id];
    return prices;
  }
  const f = async () => {
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
    let allocPoi = parseInt(0x4f, 10);

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

    debugger;
  };
  const chunk = (arr, n) =>
    arr.length ? [arr.slice(0, n), ...chunk(arr.slice(n), n)] : [];

  return (
    <div id="log">
      <button
        onClick={() => {
          console.log("dsa");
          f();
        }}
      />
    </div>
  );
};
export default AuroraSwap;

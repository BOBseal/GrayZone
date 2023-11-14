import abi from './ABIS/passAbi.json'
import bbi from './ABIS/genesisMintAbi.json'
import sbi from './ABIS/GRAYSTORE.json'
import tbi from './ABIS/TransferAbi.json'
import ebi from './ABIS/erc20.json'
import mbi from './ABIS/NftMarket.json'
import fbi from './ABIS/Form.json'

export const PassAddress ={
    goerli: {
        address: "0xEeAE8b69A51f6e8721cb5F42f858E6A8004e1503"
    },
    lineaTestnet:"0x603C582b0f18E87a27E4A8884Be810884cc9558D"
};

export const genesisMinter = {
    goerli:{
        address:"0xB1472af0B33A96b5E669E572A35B0D8f915ebB4a",
        chainId : "0x5"
    },
    lineaTestnet:"0x598E86ddd7deF373D9bc8a50ce7DF53C1E8D3C56"
}

export const storageUnit = {
    goerli:"",
    lineaTestnet:"0x0589c28794A2217E385b2B42735edEc149C0c7ae"
}

export const TransferUnit={
    goerli:"",
    lineaTestnet:"0x5530D413ed85aFE11AF1871B44bD162FD9966153"
}

export const Market ={
    lineaTestnet:"0x49f8198a701c27d86a1F5fb461F80d8569751F45"
}
export const Lender = {
    lineaTestnet:"0xC104970c3A4cd2EacFf17227992EB44F52c3Fe7d"
}
export const HireForm = {
    lineaTestnet:"0x90592ddb549608376960f89cAa2C123AA3A36e26",
    fuse:"0xEB3A60E47a899B8776fb36B5EEDd16e589E722Ae",
    mantle:"0xc06a80778af273801ed5C14AB46883c446Dd6e23",
    polygon:"0x042929007BFb97363741D79DDf9A1aA4C2b7EBC9",
    base:"0x0ff9Ef29BD23c82E260aDEC858Aa1d7Cdf6ad33d"
}

export const MinterAbi = bbi.abi;
export const PassAbi = abi.abi;
export const StorageAbi = sbi.abi;
export const TransferAbi = tbi.abi;
export const ERC20Abi = ebi.abi;
export const MarketAbi = mbi.abi;
export const FormAbi = fbi.abi;
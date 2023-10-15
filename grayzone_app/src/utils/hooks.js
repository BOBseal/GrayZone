import { ethers } from "ethers";
import { genesisMinter, MinterAbi , PassAbi , PassAddress, storageUnit , StorageAbi , TransferAbi , TransferUnit, ERC20Abi} from "./constants";
import { lineaTestNetwork } from "./networkConfigs";

export const changeNetworkToLineaTestnet= async()=>{
    try {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{chainId:"0xe704"}],
        });
    } catch (error) {
        console.log(error)
    }
}

export const connectContract=async(account)=>{
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner(account); 
        const contract = new ethers.Contract( genesisMinter.lineaTestnet,MinterAbi, signer);
        return contract;     
    } catch (error) {
        console.log(
            error
        )
    }
}

export const connectNFTContract = async(account)=>{
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner(account); 
        const contract = new ethers.Contract( PassAddress.lineaTestnet,PassAbi, signer);
        return contract;     
    } catch (error) {
        console.log(
            error
        )
    }
}

export const connectStorageContract = async(acc) =>{
    try {
        const p = new ethers.providers.Web3Provider(window.ethereum);
        const s = p.getSigner(acc);
        const contract = new ethers.Contract(storageUnit.lineaTestnet , StorageAbi , s);
        return contract;
    } catch (error) {
        console.log(error)
    }
}

export const connectTransferContract = async(acc) =>{
    try {
        const p = new ethers.providers.Web3Provider(window.ethereum);
        const s = p.getSigner(acc);
        const contract = new ethers.Contract(TransferUnit.lineaTestnet , TransferAbi , s);
        return contract;
    } catch (error) {
        console.log(error)
    }
}

export const connectErc20 = async(addr, token)=>{
    try {
        const p = new ethers.providers.Web3Provider(window.ethereum);
        const s = p.getSigner(addr);
        const contract = new ethers.Contract(token , ERC20Abi , s);
        return contract;
    } catch (error) {
        console.log(error)
    }
}

export function unixTimeToHumanReadable(seconds)

{
    // Save the time in Human
    // readable format
    let ans = "";

    // Number of days in month
    // in normal year
    let daysOfMonth = [ 31, 28, 31, 30, 31, 30,
                          31, 31, 30, 31, 30, 31 ];

    let currYear, daysTillNow, extraTime,
        extraDays, index, date, month, hours,
        minutes, secondss, flag = 0;

    // Calculate total days unix time T
    daysTillNow = parseInt(seconds / (24 * 60 * 60), 10);
    extraTime = seconds % (24 * 60 * 60);
    currYear = 1970;

    // Calculating current year
    while (true) {
    if (currYear % 400 == 0
        || (currYear % 4 == 0 && currYear % 100 != 0)) {
        if (daysTillNow < 366) {
            break;
        }
        daysTillNow -= 366;
    }
    else {
        if (daysTillNow < 365) {
            break;
        }
        daysTillNow -= 365;
    }
    currYear += 1;
}

    // Updating extradays because it
    // will give days till previous day
    // and we have include current day
    extraDays = daysTillNow + 1;

    if (currYear % 400 == 0 ||
       (currYear % 4 == 0 &&
        currYear % 100 != 0))
        flag = 1;

    // Calculating MONTH and DATE
    month = 0; index = 0;
    if (flag == 1)
    {
        while (true)
        {
            if (index == 1)
            {
                if (extraDays - 29 < 0)
                    break;

                month += 1;
                extraDays -= 29;
            }
            else
            {
                if (extraDays -
                    daysOfMonth[index] < 0)
                {
                    break;
                }
                month += 1;
                extraDays -= daysOfMonth[index];
            }
            index += 1;
        }
    }
    else
    {
        while (true)
        {
            if (extraDays - daysOfMonth[index] < 0)
            {
                break;
            }
            month += 1;
            extraDays -= daysOfMonth[index];
            index += 1;
        }
    }

    // Current Month
    if (extraDays > 0)
    {
        month += 1;
        date = extraDays;
    }
    else
    {
        if (month == 2 && flag == 1)
            date = 29;
        else
        {
            date = daysOfMonth[month - 1];
        }
    }

    // Calculating HH:MM:YYYY
    hours = parseInt(extraTime / 3600, 10);
    minutes = parseInt((extraTime % 3600) / 60, 10);
    secondss = parseInt((extraTime % 3600) % 60, 10);

    ans += date.toString();
    ans += "/";
    ans += month.toString();
    ans += "/";
    ans += currYear.toString();
    ans += " ";
    ans += hours.toString();
    ans += ":";
    ans += minutes.toString();
    ans += ":";
    ans += secondss.toString();

    // Return the time
    return ans;
}

export const homelink = "http://localhost:3000"

//export const lineaTestId = "0xe704";
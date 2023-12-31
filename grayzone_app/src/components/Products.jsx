import Link from 'next/link'
import React from 'react'

const styl = {
  menu: 'hover:underline drop-shadow-lg font-semibold p-1 rounded-full w-[14rem] flex justify-center '
}
const Products = ({functions}) => {
  return (
    <div className='absolute w-[18rem] top-[3.1rem] border z-50 bg-gradient-to-br to-[#b67ef5] from-[#1D023C] from-10% to-85% rounded-lg'>
        <div className='flex flex-col justify-center items-center gap-2 p-4' onClick={()=>functions()}>
            <Link href={'/'} onClick={()=> alert("Coming Soon")}><p className={styl.menu}>GraySale : The LaunchPad</p></Link>
            <Link href={'/'}><p onClick={()=>alert("Associate Your Wallets or Zonepass with a Culture Badges : Coming Soon")} className={styl.menu}>Culture Badge Attestation</p></Link>
            <Link href={'/'} onClick={()=> alert("MultiProtocol Bridge Coming Soon ... Choose your own provider ;-)")}><p>GrayBridge : The Bridge</p></Link>
            {/*<Link href={'/'}><p className={styl.menu}>ERC20 TOOLS</p></Link>
            <Link href={'/'}><p className={styl.menu}>ERC721 TOOLS</p></Link>
            <Link href={'/'}><p className={styl.menu}>ERC1155 TOOLS</p></Link>
            <Link href={'/'}><p className={styl.menu}>AUTOPAY</p></Link>
            <Link href={'/'}><p className={styl.menu}>LENDING/BORROWING</p></Link>
            <Link href={'/'}><p className={styl.menu}>DEX</p></Link>
            <Link href={'/'}><p className={styl.menu}>NFT MARKETPLACE</p></Link>*/}
            {/*<Link href={'/hire'}><p className={styl.menu}>Hire Us</p></Link>*/}
        </div>
    </div>
  )
}

export default Products
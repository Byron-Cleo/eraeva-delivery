import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { Metadata } from "next";
import { redirect} from "next/navigation";
import { ShippingAddress } from "@/types";
import {getUserById} from "@/lib/actions/user.actions";
import ShippingAddressForm from "./shipping-address-form";

export const metadata: Metadata = {
  title: "Shipping Address",
};

const ShippingAddressPage = async () => {
    const cart = await getMyCart();
    
    if(!cart || cart.items.length === 0) {
        redirect("/cart");
    }
    
    //get userId from session 
    const session = await auth()
    const userId = session?.user?.id;
    if(!userId) throw new Error("User has not id");
    
    const user = await getUserById(userId);
    console.log("UUU===>>>", user)

  return <div><ShippingAddressForm address={user.address as ShippingAddress} /> </div>;
};

export default ShippingAddressPage;

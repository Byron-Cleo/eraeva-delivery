"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import { Cart } from "@/types";

const CartTable = ({ cart }: { cart?: Cart }) => {
    //then initailze the imported packages for their functionlities
    const router = useRouter();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    return ( <>
    <h1 className="py-4 h2-bold">Shopping Cart</h1>
    {!cart || cart.items.length === 0 ? (
        <div>
            Cart is empty. <Link href="/">Go to shopping</Link>
        </div>
    ) : (
        <div className="grid md:grid-cols-4 md:gap-5 overflow-x-auto">
            <div className="overflow-x-auto md: col-span-3"> Table</div>
        </div>
    )}
    </> );
}
 
export default CartTable;
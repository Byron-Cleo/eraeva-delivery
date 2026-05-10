"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Utensils } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ProductPrice from "./menu-price";
import Rating from "./rating";
import { Product } from "@/types";

const BURST_PARTICLES = [
  { tx: "-24px", ty: "-24px" },
  { tx: "0px", ty: "-30px" },
  { tx: "24px", ty: "-24px" },
  { tx: "30px", ty: "0px" },
  { tx: "24px", ty: "24px" },
  { tx: "0px", ty: "30px" },
  { tx: "-24px", ty: "24px" },
  { tx: "-30px", ty: "0px" },
];

const ProductCard = ({ product }: { product: Product }) => {
  const [liked, setLiked] = useState(false);
  const [burst, setBurst] = useState(false);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setBurst(true);
    setTimeout(() => setBurst(false), 700);
  };

  return (
    <Card className="w-full max-w-md justify-self-center overflow-hidden transition-shadow duration-300 hover:shadow-lg group relative">
      <div className="absolute top-3 left-3 z-10 flex items-center">
        <button
          onClick={handleLike}
          className="p-1.5 rounded-full bg-white/80 hover:bg-white shadow-sm transition-all duration-200 hover:scale-110 relative peer"
        >
          {burst &&
            BURST_PARTICLES.map((p, i) => (
              <span
                key={i}
                className="heart-bubble"
                style={
                  {
                    "--tx": p.tx,
                    "--ty": p.ty,
                    animationDelay: `${i * 30}ms`,
                  } as React.CSSProperties
                }
              />
            ))}
          <Heart
            className={`w-6 h-6 transition-colors duration-200 ${burst ? "heart-pop" : ""} ${
              liked ? "fill-rose-500 text-rose-500" : "fill-none text-gray-400"
            }`}
          />
        </button>
        {/* Tooltip to the right with left-pointing arrow */}
        <div className="ml-0.5 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 flex items-center">
          <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[6px] border-r-rose-500" />
          <span className="whitespace-nowrap rounded-md bg-rose-500 px-2.5 py-1 text-[11px] text-white shadow-md">
            {liked ? "Added to Wishlist" : "Add Wishlist"}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-end px-4 pt-4 pb-2">
        <Link href={`/menu/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            height={200}
            width={200}
            priority={true}
            className="rounded-full object-cover aspect-square transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      </div>
      <CardContent className="p-4 grid gap-2">
        <span className="inline-block w-fit text-[11px] font-medium uppercase tracking-wide text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
          {product.category}
        </span>
        <Link href={`/menu/${product.slug}`}>
          <h2 className="text-sm font-semibold hover:text-primary transition-colors duration-200">
            {product.name}
          </h2>
        </Link>
        <p className="text-xs text-muted-foreground">{product.description}</p>
        <div className="flex items-center gap-2">
          <Rating value={Number(product.rating)} />
          <span className="text-sm font-semibold">
            {Number(product.rating).toFixed(1)}
          </span>
        </div>
        {product.stock > 0 ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 p-1.5 rounded-lg bg-green-700 text-white shadow-md">
              <Utensils className="w-4 h-4 stroke-[2.5]" />
              <span className="text-xs font-black tracking-wide">
                ({product.numReviews})
              </span>
            </div>
            <ProductPrice value={Number(product.price)} />
          </div>
        ) : (
          <p className="text-destructive text-sm">Out of Stock</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;

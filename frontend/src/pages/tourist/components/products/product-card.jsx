// products.jsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { ShareButton } from "@/components/ui/share-button";
import AnimatedLikeButton from "./like";

export default function ProductCard({ product, currency, token, addToCart }) {
    return (
        <Card key={product._id}>
            <div className="flex flex-col p-4 space-y-4 h-full">
                <div className="w-full relative group">
                    <img
                        src={product.image || "https://via.placeholder.com/150"}
                        alt={product.name}
                        className="rounded-lg w-full h-[230px] object-cover"
                    />
                    <div
                        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex items-end"
                        style={{
                            background: `linear-gradient(180deg, 
            rgba(0,0,0,0) 62%, 
            rgba(0,0,0,0.00345888) 63.94%, 
            rgba(0,0,0,0.014204) 65.89%, 
            rgba(0,0,0,0.0326639) 67.83%, 
            rgba(0,0,0,0.0589645) 69.78%, 
            rgba(0,0,0,0.0927099) 71.72%, 
            rgba(0,0,0,0.132754) 73.67%, 
            rgba(0,0,0,0.177076) 75.61%, 
            rgba(0,0,0,0.222924) 77.56%, 
            rgba(0,0,0,0.267246) 79.5%, 
            rgba(0,0,0,0.30729) 81.44%, 
            rgba(0,0,0,0.341035) 83.39%, 
            rgba(0,0,0,0.367336) 85.33%, 
            rgba(0,0,0,0.385796) 87.28%, 
            rgba(0,0,0,0.396541) 89.22%, 
            rgba(0,0,0,0.4) 91.17%)`
                        }}
                    >
                        <div className="flex items-center w-full justify-between">
                            <span className="text-white font-medium text-base truncate">{product.name}</span>
                            <div className="flex space-x-2">
                                <AnimatedLikeButton
                                    liked={true}
                                    productId={product._id}
                                    token={token}
                                />
                                <ShareButton className="p-2 rounded-full bg-gray-100" id={product._id} name="product" />
                            </div>
                        </div>
                    </div>
                </div>
                <span className="text-xl font-bold !mb-4">
                    {product.name}
                </span>
                <div className="!mt-auto w-full flex items-center justify-between">
                    <span className="text-xl font-bold">
                        ${currency}{(product.price * 1).toFixed(2)}
                    </span>
                    <Button variant="outline" onClick={() => addToCart(product)}>
                        Add to Cart
                    </Button>
                </div>
            </div>
        </Card>
    )
}


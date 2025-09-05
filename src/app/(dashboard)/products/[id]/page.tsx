import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Edit, Trash2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import data from "../../../../../data/data.json";
import { Product } from "@/lib/types";

async function getProduct(id: string): Promise<Product | undefined> {
  const product = data.products.find((p) => p.id === id);
  if (!product) return undefined;
  return {
    ...product,
    status: product.status as "Active" | "Archived" | "Draft",
  };
}

interface ProductDetailsPageProps {
  params: { id: string };
}

export default async function ProductDetailsPage({ params: { id } }: ProductDetailsPageProps) {
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Back Button and Page Title */}
      <div className="flex items-center gap-4">
        <Link href="/products">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Product Details
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Product
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          {/* Product Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{product.name}</CardTitle>
              <CardDescription>Product ID: {product.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{product.description}</p>
            </CardContent>
          </Card>

          {/* Product Variants Card - NEW */}
          {product.variants && product.variants.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Variants</CardTitle>
                <CardDescription>
                  Different options available for this product.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {product.variants.map((variant) => (
                      <TableRow key={variant.id}>
                        <TableCell className="font-medium">
                          {variant.type}
                        </TableCell>
                        <TableCell>{variant.value}</TableCell>
                        <TableCell className="text-right">
                          ${variant.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {variant.stock}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Product Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Base Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-semibold">Category</div>
                <div className="text-muted-foreground">{product.category}</div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-2">
                <div className="font-semibold">Base Price</div>
                <div className="font-semibold">${product.price.toFixed(2)}</div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-2">
                <div className="font-semibold">Base Stock</div>
                <div>{product.stock} units available</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant={
                  product.status === "Archived"
                    ? "destructive"
                    : product.status === "Draft"
                    ? "secondary"
                    : "default"
                }
                className="text-sm"
              >
                {product.status}
              </Badge>
            </CardContent>
          </Card>
          {/* Product Image Card */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              <AspectRatio ratio={1 / 1}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded-md"
                />
              </AspectRatio>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

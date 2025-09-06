"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { MoreHorizontal, PlusCircle, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import data from "../../../../data/data.json";
import { Product, ProductStatus } from "@/lib/types";
import { motion, Variants } from "framer-motion";

export default function ProductsPage() {
  const [activeTab, setActiveTab] = React.useState("all");
  const [searchTerm, setSearchTerm] = React.useState("");

  const products = data.products as Product[];

  const filteredProducts = products.filter((product) => {
    const matchesTab =
      activeTab === "all" || product.status.toLowerCase() === activeTab;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getBadgeVariant = (status: ProductStatus) => {
    switch (status) {
      case "Active":
        return "default";
      case "Draft":
        return "secondary";
      case "Archived":
        return "destructive";
      default:
        return "outline";
    }
  };

  const gridVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link href="/products/create">
            <Button size="sm" className="h-9 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Product
              </span>
            </Button>
          </Link>
        </div>
      </div>

      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredProducts.map((product: Product) => (
          <motion.div key={product.id} variants={cardVariants}>
            <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader className="p-0">
                <Link href={`/products/${product.id}`} className="block">
                  <div className="aspect-video relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
              </CardHeader>
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <Link
                    href={`/products/${product.id}`}
                    className="hover:underline"
                  >
                    <CardTitle className="text-lg leading-tight">
                      {product.name}
                    </CardTitle>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        aria-haspopup="true"
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="text-sm text-muted-foreground mb-4">
                  {product.category}
                </CardDescription>

                <div className="mt-auto flex justify-between items-center text-sm">
                  <div className="font-semibold text-lg">
                    ${product.price.toFixed(2)}
                  </div>
                  <Badge variant={getBadgeVariant(product.status)}>
                    {product.status}
                  </Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      {filteredProducts.length === 0 && (
        <div className="text-center text-muted-foreground col-span-full py-10">
          No products found.
        </div>
      )}
    </div>
  );
}

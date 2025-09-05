"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import * as React from "react";
import Image from "next/image";
import { PlusCircle, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Variant } from "@/lib/types";

// Schema for the main product form
const formSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters."),
  description: z.string().optional(),
  category: z.string().min(2, "Category is required."),
  price: z.coerce.number().positive("Price must be a positive number."),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative."),
  status: z.enum(["Active", "Draft", "Archived"]),
});

// Schema for the variant form inside the modal
const variantFormSchema = z.object({
    type: z.enum(["Size", "Color", "Material"]),
    value: z.string().min(1, "Value is required."),
    price: z.coerce.number().positive("Price must be a positive number."),
    stock: z.coerce.number().int().min(0, "Stock cannot be negative."),
});


export default function CreateProductPage() {
  const router = useRouter();
  const [variants, setVariants] = React.useState<Variant[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: 0,
      stock: 0,
      status: "Draft",
    },
  });

  const variantForm = useForm<z.infer<typeof variantFormSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(variantFormSchema) as any,
    defaultValues: {
        type: "Size",
        value: "",
        price: 0,
        stock: 0,
    }
  });
  
  const onVariantSubmit = (data: z.infer<typeof variantFormSchema>) => {
    const newVariant: Variant = {
      id: `var_${Date.now()}`,
      ...data,
    };
    setVariants((prevVariants) => [...prevVariants, newVariant]);
    variantForm.reset();
    setIsModalOpen(false);
  };
  
  const removeVariant = (id: string) => {
    setVariants((prevVariants) => prevVariants.filter(v => v.id !== id));
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };


  function onSubmit(values: z.infer<typeof formSchema>) {
    const finalProductData = {
      ...values,
      variants,
      image: imagePreview, // Include image in final data
    };
    console.log("Creating product with data:", finalProductData);
    
    toast.success("Product Created Successfully!", {
      description: `"${values.name}" has been added to your inventory.`,
      duration: 5000,
    });

    router.push("/products");
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold tracking-tight">Create Product</h1>
            <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Discard
                </Button>
                <Button type="submit">Save Product</Button>
            </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                {/* Product Details Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Product Details</CardTitle>
                        <CardDescription>Name, description, and category.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="category" render={({ field }) => (
                            <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </CardContent>
                </Card>
                {/* Product Variants Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Variants</CardTitle>
                        <CardDescription>Add different options for your product.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       {variants.length > 0 && (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {variants.map(v => (
                                <TableRow key={v.id}>
                                  <TableCell>{v.type}</TableCell>
                                  <TableCell>{v.value}</TableCell>
                                  <TableCell>${v.price.toFixed(2)}</TableCell>
                                  <TableCell>{v.stock}</TableCell>
                                  <TableCell>
                                    <Button size="icon" variant="ghost" onClick={() => removeVariant(v.id)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                       )}
                       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button type="button" size="sm" variant="outline" className="mt-4 w-full">
                                <PlusCircle className="h-3.5 w-3.5 mr-2" />
                                Add Variant
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <Form {...variantForm}>
                            <form onSubmit={variantForm.handleSubmit(onVariantSubmit)}>
                              <DialogHeader>
                                  <DialogTitle>Add New Variant</DialogTitle>
                                  <DialogDescription>Fill in the details for a new product option.</DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <FormField control={variantForm.control} name="type" render={({ field }) => (
                                    <FormItem><FormLabel>Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="Size">Size</SelectItem>
                                                <SelectItem value="Color">Color</SelectItem>
                                                <SelectItem value="Material">Material</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    <FormMessage /></FormItem>
                                )}/>
                                <FormField control={variantForm.control} name="value" render={({ field }) => (
                                    <FormItem><FormLabel>Value</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={variantForm.control} name="price" render={({ field }) => (
                                    <FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={variantForm.control} name="stock" render={({ field }) => (
                                    <FormItem><FormLabel>Stock</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                              </div>
                              <DialogFooter>
                                  <Button type="submit">Save Variant</Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                       </Dialog>
                    </CardContent>
                </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                 {/* Product Status Card */}
                 <Card>
                    <CardHeader><CardTitle>Product Status</CardTitle></CardHeader>
                    <CardContent>
                        <FormField control={form.control} name="status" render={({ field }) => (
                            <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Draft">Draft</SelectItem>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}/>
                    </CardContent>
                 </Card>
                 {/* Pricing & Stock Card */}
                 <Card>
                    <CardHeader><CardTitle>Pricing & Stock</CardTitle></CardHeader>
                    <CardContent className="grid gap-4">
                        <FormField control={form.control} name="price" render={({ field }) => (
                            <FormItem><FormLabel>Base Price</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="stock" render={({ field }) => (
                            <FormItem><FormLabel>Base Stock</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage /></FormItem>
                        )}/>
                    </CardContent>
                 </Card>
                 {/* Product Image Card */}
                 <Card>
                    <CardHeader><CardTitle>Product Image</CardTitle></CardHeader>
                    <CardContent className="relative">
                        <Input id="picture" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                        <label htmlFor="picture" className="cursor-pointer">
                          {imagePreview ? (
                            <div className="aspect-square w-full relative group">
                                <Image src={imagePreview} alt="Product image preview" fill className="object-cover rounded-md"/>
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white font-medium">Change Image</span>
                                </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg hover:bg-muted transition-colors">
                                <Upload className="h-8 w-8 text-muted-foreground" />
                                <span className="mt-2 text-sm text-muted-foreground">Click to upload</span>
                            </div>
                          )}
                        </label>
                    </CardContent>
                 </Card>
            </div>
        </div>
      </form>
    </Form>
  );
}


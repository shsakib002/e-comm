"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { useTheme } from "next-themes";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ResponsiveContainer,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Progress } from "@/components/ui/progress";
import data from "../../../../data/data.json";
import { Stat, IconName, RecentSale, RevenueData } from "@/lib/types";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

// --- Type Definitions for Chart Components ---

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: ValueType;
    color?: string;
    payload?: RevenueData;
  }>;
  label?: NameType;
  chartColors: { primary: string };
}

// --- Reusable Components & Data ---

const iconMap: Record<IconName, React.ReactNode> = {
  "dollar-sign": <DollarSign className="h-4 w-4 text-muted-foreground" />,
  users: <Users className="h-4 w-4 text-muted-foreground" />,
  "credit-card": <CreditCard className="h-4 w-4 text-muted-foreground" />,
  activity: <Activity className="h-4 w-4 text-muted-foreground" />,
};

const ChartTooltipContent = ({
  active,
  payload,
  label,
  chartColors,
}: ChartTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-card border border-border rounded-lg shadow-sm text-card-foreground text-sm">
        <p className="font-bold mb-1">{label}</p>
        {payload.map((entry, index) => {
          const color = entry.color || chartColors.primary;
          return (
            <p key={`item-${index}`} style={{ color }}>
              {`${entry.name}: ${
                typeof entry.value === "number"
                  ? entry.value.toLocaleString()
                  : entry.value
              }`}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

// --- Main Dashboard Component ---

export default function DashboardPage() {
  const { theme } = useTheme();

  const stats = data.stats as Stat[];
  const recentSales = data.recentSales as RecentSale[];
  const { revenueData, topProductsData } = data;

  const [chartColors, setChartColors] = useState({
    primary: "hsl(var(--primary))",
    muted: "hsl(var(--muted-foreground))",
    grid: "hsl(var(--border))",
    tooltipCursor: "hsl(var(--accent))",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const rootStyles = getComputedStyle(document.documentElement);
      setChartColors({
        primary: `hsl(${rootStyles.getPropertyValue("--primary").trim()})`,
        muted: `hsl(${rootStyles
          .getPropertyValue("--muted-foreground")
          .trim()})`,
        grid: `hsl(${rootStyles.getPropertyValue("--border").trim()})`,
        tooltipCursor: `hsl(${rootStyles.getPropertyValue("--accent").trim()})`,
      });
    }
  }, [theme]);

  const maxSales = topProductsData.length > 0 ? topProductsData[0].sales : 0;

  return (
    <motion.div
      className="flex-1 space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <motion.div key={stat.id} variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                {iconMap[stat.icon]}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <motion.div variants={itemVariants} className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue vs. goal.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={chartColors.primary}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={chartColors.primary}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={chartColors.grid}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke={chartColors.muted}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke={chartColors.muted}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${Number(value) / 1000}K`}
                  />
                  <Tooltip
                    cursor={{ fill: chartColors.tooltipCursor }}
                    content={<ChartTooltipContent chartColors={chartColors} />}
                  />
                  <Legend
                    wrapperStyle={{
                      color: chartColors.muted,
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke={chartColors.primary}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                  <Line
                    type="monotone"
                    dataKey="goal"
                    name="Goal"
                    stroke={chartColors.muted}
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>
                You made {recentSales.length} sales this month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={sale.avatar} alt="Avatar" />
                      <AvatarFallback>{sale.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {sale.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {sale.email}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">{sale.amount}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>
                Your best-performing products this month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {topProductsData.map((product, index) => {
                  const progressValue = (product.sales / maxSales) * 100;
                  return (
                    <div key={index} className="flex flex-col gap-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-foreground">
                          {product.name}
                        </span>
                        <span className="text-muted-foreground">
                          {product.sales.toLocaleString()} sales
                        </span>
                      </div>
                      <Progress value={progressValue} />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>New Subscriptions</CardTitle>
              <CardDescription>
                A bar chart showing monthly new subscribers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={chartColors.grid}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke={chartColors.muted}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke={chartColors.muted}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: chartColors.tooltipCursor }}
                    content={<ChartTooltipContent chartColors={chartColors} />}
                  />
                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill={chartColors.primary}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

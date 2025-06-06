"use client";

import React from "react";
import { CompoundInterestCalculator } from "./CompoundInterestCalculator";
import { motion } from "framer-motion";

export function CompoundInterestClient() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <CompoundInterestCalculator />
    </motion.div>
  );
}

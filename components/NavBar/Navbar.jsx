import dynamic from "next/dynamic";
import Link from "next/link";
import React from "react";
import { VscSearch } from "react-icons/vsc";
import styles from "./Navbar.module.scss";

const Logo = dynamic(
  () => import("@components/Logo/Logo").then((mod) => mod.Logo),
  { ssr: false }
);
export function Navbar() {
  return (
    <nav className={styles.Nav}>
      <div className="left"></div>
      <div className="center">
        <Link href="/" className={styles.logo}>
          <Logo />
        </Link>
      </div>
      <div className="right">
        <Link href="/search">
          <VscSearch />
        </Link>
      </div>
    </nav>
  );
}

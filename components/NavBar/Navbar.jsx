import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { VscSearch } from "react-icons/vsc";
import { BsListNested } from "react-icons/bs";
import styles from "./Navbar.module.scss";
import { getNewEpisodeCount } from "util/newEpisode";
import { ListContext } from "context/ListContext";

const Logo = dynamic(
  () => import("@components/Logo/Logo").then((mod) => mod.Logo),
  { ssr: false }
);

export function Navbar() {
  const { getList } = useContext(ListContext);

  const fetchNewEpisodeCount = async (fetchList) => {
    const count = await getNewEpisodeCount(fetchList);
    setNewEpisodeCount(count);
  };

  const [newEpisodeCount, setNewEpisodeCount] = useState(0);

  useEffect(() => {
    fetchNewEpisodeCount(getList());
  }, []);

  return (
    <nav className={styles.Nav}>
      <div className="left">
        <Link href="/list" className={styles.listIcon}>
          <BsListNested />
          {newEpisodeCount > 0 && (
            <div className={styles.counter}>{newEpisodeCount}</div>
          )}
        </Link>
      </div>
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

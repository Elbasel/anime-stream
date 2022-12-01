import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

import { getNewEpisodeCount } from "util/newEpisode";
import { ListContext } from "context/ListContext";

import { BsListNested } from "react-icons/bs";
import { VscSearch } from "react-icons/vsc";
import { GiPlagueDoctorProfile } from "react-icons/gi";
import styles from "./Navbar.module.scss";

const Logo = dynamic(
  () => import("@components/Logo/Logo").then((mod) => mod.Logo),
  { ssr: false }
);

export function Navbar() {
  const { list, notificationsList } = useContext(ListContext);

  const fetchNewEpisodeCount = async (fetchList, notificationsList) => {
    // debugger
    // fetchList = fetchList.filter(item => item?.episodeList)
    const count = await getNewEpisodeCount(fetchList, notificationsList);

    setNewEpisodeCount(count);
  };

  const [newEpisodeCount, setNewEpisodeCount] = useState(0);

  useEffect(() => {
    fetchNewEpisodeCount(list, notificationsList);
  }, [list, notificationsList]);

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
      <div className={styles.right}>
        <Link href="/search">
          <VscSearch />
        </Link>
        <Link href="/profile">
        <GiPlagueDoctorProfile style={{marginTop: '-10px'}}/>
        </Link>
      </div>
    </nav>
  );
}

import Link from "next/link";
import AuthStatus from "@/components/AuthStatus";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          BlockNote Notes
        </Link>
        <AuthStatus />
      </nav>
    </header>
  );
}

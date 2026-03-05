import { useMemo } from "react";
import { toast } from "react-toastify";
import styles from "./WishlistButton.module.scss";
import { useWishlist } from "../../contexts/WishlistContext";
import { WishlistAuthError } from "../../services/apis/wishlist";
import { useDialog } from "../../contexts/DialogContext";

interface WishlistButtonProps {
  gameId: string;
  snapshot?: { title?: string; thumb?: string | null };
  initialWishlisted?: boolean;
  size?: "sm" | "md" | "lg";
  onChange?: (wishlisted: boolean) => void;
  showLabel?: boolean;
}

export const WishlistButton = ({
  gameId,
  snapshot,
  initialWishlisted = false,
  size = "md",
  onChange,
  showLabel = true,
}: WishlistButtonProps) => {
  const dialog = useDialog();
  const { wishlistSet, toggleWishlist, pendingGameIds, isWishlistLoaded } = useWishlist();

  const isWishlisted = useMemo(() => {
    if (!isWishlistLoaded) {
      return initialWishlisted;
    }
    return wishlistSet.has(gameId);
  }, [gameId, isWishlistLoaded, initialWishlisted, wishlistSet]);

  const isPending = pendingGameIds.has(gameId);

  const handleToggle = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please sign in to save to wishlist.");
      dialog.openDialog("signin");
      return;
    }

    try {
      await toggleWishlist(gameId, snapshot);
      onChange?.(!isWishlisted);
      toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
    } catch (err) {
      if (err instanceof WishlistAuthError) {
        toast.info(err.message);
        dialog.openDialog("signin");
      } else {
        toast.error(err instanceof Error ? err.message : "Wishlist update failed");
      }
    }
  };

  return (
    <button
      type="button"
      className={`${styles.button} ${styles[size]}`}
      onClick={handleToggle}
      disabled={isPending}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <span className={`${styles.icon} ${isWishlisted ? styles.filled : ""}`}>
        {isWishlisted ? "❤️" : "♡"}
      </span>
      {showLabel && (
        <span className={styles.label}>
          {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
        </span>
      )}
    </button>
  );
};

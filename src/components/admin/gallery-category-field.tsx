"use client";

import {
  type ChangeEvent,
  type FC,
  type KeyboardEvent,
  useRef,
  useState,
} from "react";
import FormField from "@/components/admin/form-field";
import adminInputClassName from "@/lib/admin-input-class-name";

type GalleryCategoryFieldProps = {
  categories: string[];
  defaultValue?: string;
  errorMessage?: string;
  className?: string;
};

// The select's value that opens the "new gallery" modal; it's never submitted.
const newGalleryValue = "new-gallery";

// Each category is one gallery on the home page. A select prevents typos that would quietly
// start a second gallery; "New gallery…" opens a modal to name one, which is then added to
// the select. It becomes a real gallery once a photo is saved in it.
const GalleryCategoryField: FC<GalleryCategoryFieldProps> = ({
  categories,
  defaultValue,
  errorMessage,
  className,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [addedCategories, setAddedCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(defaultValue ?? "");
  const shownCategories = [...categories, ...addedCategories];

  const closeModal = (): void => dialogRef.current?.close();

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    if (event.currentTarget.value !== newGalleryValue) {
      setSelectedCategory(event.currentTarget.value);
      return;
    }
    // The select stays on the current gallery until a new name is added.
    if (nameInputRef.current) nameInputRef.current.value = "";
    dialogRef.current?.showModal();
  };

  // An existing name selects that gallery rather than adding a duplicate.
  const addGallery = (): void => {
    const name = nameInputRef.current?.value.trim() ?? "";
    if (name === "") {
      nameInputRef.current?.focus();
      return;
    }
    const existingCategory = shownCategories.find(
      (category) => category.toLowerCase() === name.toLowerCase(),
    );
    if (!existingCategory) setAddedCategories([...addedCategories, name]);
    setSelectedCategory(existingCategory ?? name);
    closeModal();
  };

  // Enter adds the gallery instead of submitting the surrounding form.
  const handleNameKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    addGallery();
  };

  return (
    <div className={className}>
      <FormField name="category" label="Gallery" errorMessage={errorMessage}>
        <select
          id="category"
          name="category"
          required
          value={selectedCategory}
          onChange={handleSelectChange}
          aria-invalid={errorMessage ? true : undefined}
          aria-describedby={errorMessage ? "category-error" : undefined}
          className={adminInputClassName}
        >
          <option value="" disabled>
            Choose a gallery
          </option>
          {shownCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
          <option value={newGalleryValue}>New gallery…</option>
        </select>
      </FormField>
      {/* Not a <form>: it sits inside the photo form, and forms can't be nested. */}
      <dialog
        ref={dialogRef}
        aria-labelledby="new-gallery-title"
        className="m-auto w-80 max-w-11/12 rounded-lg border border-admin-dark/15 bg-admin-light p-5 text-admin-dark shadow-lg backdrop:bg-black/40 dark:border-admin-light/15 dark:bg-admin-dark dark:text-admin-light"
      >
        <h2
          id="new-gallery-title"
          className="mt-0 mb-3 text-base font-semibold"
        >
          New gallery
        </h2>
        <label
          htmlFor="new-gallery-name"
          className="mb-1 block text-sm font-medium"
        >
          Name
        </label>
        <input
          ref={nameInputRef}
          id="new-gallery-name"
          autoComplete="off"
          onKeyDown={handleNameKeyDown}
          className={adminInputClassName}
        />
        <div className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={closeModal}
            className="rounded-md px-4 py-2 text-sm enabled:hover:bg-admin-dark/5 dark:enabled:hover:bg-admin-light/10"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={addGallery}
            className="rounded-md bg-admin-accent px-4 py-2 text-sm font-medium text-white enabled:hover:bg-admin-accent/90 dark:bg-admin-accent-dark dark:text-admin-dark dark:enabled:hover:bg-admin-accent-dark/90"
          >
            Add gallery
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default GalleryCategoryField;

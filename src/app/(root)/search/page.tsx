import MenuCard from "@/components/shared/menu/menu-card";
import { Button } from "@/components/ui/button";
import { getAllMenus, getAllCategories } from "@/lib/actions/menu.actions";
import Link from "next/link";

const prices = [
  {
    name: "Ksh 1 to Ksh 50",
    value: "1-50",
  },
  {
    name: "Ksh 51 to Ksh 100",
    value: "51-100",
  },
  {
    name: "Ksh 101 to Ksh 200",
    value: "101-200",
  },
  {
    name: "Ksh 201 to Ksh 500",
    value: "201-500",
  },
  {
    name: "Ksh 501 to Ksh 1000",
    value: "501-1000",
  },
];

const ratings = [4, 3, 2, 1];

const sortOrders = ["newest", "lowest", "highest", "rating"];

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>;
}) {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
  } = await props.searchParams;

  const isQuerySet = q && q !== "all" && q.trim() !== "";
  const isCategorySet =
    category && category !== "all" && category.trim() !== "";
  const isPriceSet = price && price !== "all" && price.trim() !== "";
  const isRatingSet = rating && rating !== "all" && rating.trim() !== "";

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `
      Search ${isQuerySet ? q : ""} 
      ${isCategorySet ? `: Category ${category}` : " "}
      ${isPriceSet ? `: Price ${price}` : " "}
      ${isRatingSet ? `: Rating ${rating}` : " "}
      `,
    };
  } else {
    return {
      title: "Search Products",
    };
  }
}

const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  } = await props.searchParams;

  //construct filter URL
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };

    if (c) params.category = c;
    if (p) params.price = p;
    if (s) params.sort = s;
    if (r) params.rating = r;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const products = await getAllMenus({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  });

  const categories = await getAllCategories();

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        {/*START: Category Links */}
        <div className="mt-3 mb-2 text-xl">Category</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                href={getFilterUrl({ c: "all" })}
                className={`${(category === "all" || category === "") && "font-bold"}`}
              >
                Any
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.category}>
                <Link
                  href={getFilterUrl({ c: cat.category })}
                  className={`${category === cat.category && "font-bold"}`}
                >
                  {cat.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/*END: Category Links */}

        {/* START: Price Links */}
        <div className="mt-8 mb-2 text-xl">Price</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${price === "all" && "font-bold"}`}
                href={getFilterUrl({ p: "all" })}
              >
                Any
              </Link>
            </li>
            {prices.map((pri) => (
              <li key={pri.value}>
                <Link
                  className={`${price === pri.value && "font-bold"}`}
                  href={getFilterUrl({ p: pri.value })}
                >
                  {pri.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* END: Price Links */}

        {/* START: Rating Links */}
        <div className="mt-8 mb-2 text-xl">Customer Ratings</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${rating === "all" && "font-bold"}`}
                href={getFilterUrl({ r: "all" })}
              >
                Any
              </Link>
            </li>
            {ratings.map((rate) => (
              <li key={rate}>
                <Link
                  className={`${rating === rate.toString() && "font-bold"}`}
                  href={getFilterUrl({ r: `${rate}` })}
                >
                  {`${rate} starts & up`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* END: Rating Links */}
      </div>
      {/* End of filter links */}
      <div className="md:col-span-4 spce-y-4">
        <div className="flex-col my-4 md:flex-row flex-between">
          <div className="flex items-center">
            {q !== "all" && q !== "" && "Query/Search: " + q}
            {category !== "all" && category !== "" && "Category: " + category}
            {price !== "all" && " Price: " + price}
            {rating !== "all" && " Rating: " + rating + " starts & up"}
            &nbsp;
            {(q !== "all" && q !== "") ||
            (category !== "all" && category !== "") ||
            rating !== "all" ||
            price !== "all" ? (
              <Button variant="link">
                {" "}
                <Link href="/search">Clear</Link>
              </Button>
            ) : null}
          </div>
          <div>
            Sort By:{" "}
            {sortOrders.map((s) => (
              <Link
                key={s}
                className={`mx-2 ${sort == s && "font-bold"}`}
                href={getFilterUrl({ s })}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.data.length === 0 && <div>No Products Found</div>}
          {products.data.map((product) => (
            <MenuCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

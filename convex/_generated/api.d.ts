/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as articles from "../articles.js";
import type * as auth from "../auth.js";
import type * as contact from "../contact.js";
import type * as contributions from "../contributions.js";
import type * as discussion from "../discussion.js";
import type * as figures from "../figures.js";
import type * as http from "../http.js";
import type * as lexicon from "../lexicon.js";
import type * as members from "../members.js";
import type * as memberships from "../memberships.js";
import type * as permissions from "../permissions.js";
import type * as seedLusopedia from "../seedLusopedia.js";
import type * as seedLusopedia2 from "../seedLusopedia2.js";
import type * as seedLusopedia3 from "../seedLusopedia3.js";
import type * as seedLusopedia4 from "../seedLusopedia4.js";
import type * as seedLusopedia5 from "../seedLusopedia5.js";
import type * as seedLusopedia6 from "../seedLusopedia6.js";
import type * as seedLusopedia7 from "../seedLusopedia7.js";
import type * as seedLusopedia8 from "../seedLusopedia8.js";
import type * as stripe from "../stripe.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  articles: typeof articles;
  auth: typeof auth;
  contact: typeof contact;
  contributions: typeof contributions;
  discussion: typeof discussion;
  figures: typeof figures;
  http: typeof http;
  lexicon: typeof lexicon;
  members: typeof members;
  memberships: typeof memberships;
  permissions: typeof permissions;
  seedLusopedia: typeof seedLusopedia;
  seedLusopedia2: typeof seedLusopedia2;
  seedLusopedia3: typeof seedLusopedia3;
  seedLusopedia4: typeof seedLusopedia4;
  seedLusopedia5: typeof seedLusopedia5;
  seedLusopedia6: typeof seedLusopedia6;
  seedLusopedia7: typeof seedLusopedia7;
  seedLusopedia8: typeof seedLusopedia8;
  stripe: typeof stripe;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};

// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using IdentityServer4.Models;
using System.Collections.Generic;

namespace IdentityServer
{
    public static class Config
    {
        public static IEnumerable<IdentityResource> Ids =>
            new IdentityResource[]
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
            };


        public static IEnumerable<ApiResource> Apis =>
            new ApiResource[]
            {
                new ApiResource("api", "Tasks API")
            };


        public static IEnumerable<Client> Clients =>
            new Client[]
            {
                new Client
                {
                    ClientId = "interactive.public",
                    ClientName = "Task Web Client",
                    ClientUri = "http://identityserver.io",

                    AllowedGrantTypes = GrantTypes.Code,
                    RequirePkce = true,
                    RequireClientSecret = false,
                    RequireConsent = true,
                    RedirectUris =
                    {
                        "https://localhost:5001",
                        "https://localhost:5001/signin-callback",
                        "https://localhost:5001/silent-renew",
                        "https://localhost:5001/popup",
                    },

                    PostLogoutRedirectUris = { "https://localhost:5001" },
                    AllowedCorsOrigins = { "https://localhost:5001" },
                    AllowOfflineAccess = true,
                    AllowedScopes = { "openid", "profile", "api" }
                }
            };
    }
}
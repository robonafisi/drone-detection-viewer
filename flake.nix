{
  description = "Xoul AI frontend";

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable-small";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        inherit nixpkgs;
        # see https://github.com/nix-community/poetry2nix/tree/master#api for more functions and examples.
        pkgs = nixpkgs.legacyPackages.${system};
        pkg_deps = with pkgs; [
          unzip
          zip
          bun
          openssl
          postgresql_16
          cassandra
          awscli
          turbo
          nodejs_20
        ];
      in
      {
        devShells.default = pkgs.mkShell {
          name = "Xoul Frontend";
          buildInputs = pkg_deps;
          shellHook = ''
            npm install turbo --ignore-scripts
            npm install
          '';
        };

      }
    );
}

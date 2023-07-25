module.exports = {
    tagFormat: "${version}",
    branches: ["master", "stage"],
    plugins: [
        ["@semantic-release/npm", { npmPublish: false }],
        "@semantic-release/github",
        [
            "semantic-release-plugin-update-version-in-files",
            {
                "files": [
                    "style.css"
                ],
                "placeholder": "0.0.0-development"
            }
        ]
    ]
};
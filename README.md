# Just Meat

JustMeat.co is a website to curate resources on carnivorous eating, paleolithic ketogenic diet and medicine, and zero carb lifestyles.

## How to Setup

Pre-requisites: Ruby and Jekyll

```
git clone https://github.com/bitstein/justmeat.co.git
cd justmeat.co
bundle install
bundle exec jekyll serve
```

You can then open the website in your browser at `localhost:4000`.

## How to Deploy

This repo comes with a deploy script for AWS S3 using the `awscli` which can be installed with `pip install awscli`. If you use Cloudflare, rename `bin/purge_cache.example` to `bin/purge_cache`. Change the variables to your Cloudflare credentials. If you don't remove `bin/purge_cache` from `bin/deploy`. Finally, use `chmod +x bin/purge_cache` to make it executable.

## Contributing

Contributions are greatly appreciated. If you have any content submissions, organization patches, or theming updates, fork the repo and submit a PR or submit an issue.

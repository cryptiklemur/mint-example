# Example App

### Requirements

A working local environment with:

    WordPress Site
    Microfrontend (can be any app, but one of them has to be a NextJS application with App or Page Router, hosted on a path)
    Database Server
    Redis Instance
    API Server
    Dynamic Routing based on rules and traffic allocation

Imagine a business that needs to do constant A/B testing to test new features and experiences. We want to be able to serve multiple experiences on the frontend using microfrontends. Lets say we want to serve 20% users Microfrontend A, 30% Microfrontend B, and 50% the Original Version which is our WordPress backend.

    How would you set up the infrastructure?
    How would you make sure the experience is optimized and backends can be served quickly and efficiently?
    How would you measure traffic going to the different backends and gather the amount of visitors being sent there?
    How would you make decisions on what backend to serve to a certain visitor?
    Can you list the pros and cons of your approach?


### Usage

1. copy `.env.dist` to `.env`
2. Run `docker compose up -d`
3. Head to `http://localhost/wp-admin` and set up wordpress
4. Update the permlink type to anything but `Plain` in http://localhost/wp-admin/options-permalink.php
   1. Needed to enable /wp-json endpoint....
5. Head to `http://localhost/`
6. Hit <a href="http://localhost:9090/reset-variant">http://localhost:9090/reset-variant</a> to clear the variant

### Elaboration

1. How would you set up the infrastructure

   I've set up the infrastructure in this repo. The gist of it is to have a load balancer (specifically traefik) in front of the apps

2. How would you make sure the experience is optimized and backends can be served quickly and efficiently?

   This is a more involved question that would depend on requirements and potential throughout (don't want to spend unnecessarily).
   I've added caching to the api endpoint that fetches the home page, as an example. This pattern could be extended out. In the case of using Next.js's SSG, you do get a boon to user experience as theres no loading screens. In production, this would also be cached, and revalidation would happen on the backend.
   Along with this, i would add Cloudflare in front of this, to take *huge* advantage of their caching network, ensuring users across the US are being delivered the cached content at the edge.
   Also, looking into better caching in wordpress itself, integrating redis into its flow.

3. How would you measure traffic going to the different backends and gather the amount of visitors being sent there?

   I didn't want to go too overboard on this demo, but tracking would entirely be done with a Prometheus/Grafana setup.
   If a traefik exporter isn't enough (I believe it only shows the number of requests, not users), more specific observability
   could be added. Ideally, you'd use some sort of tracing to track users.

4. How would you make decisions on what backend to serve to a certain visitor?
   
   I'm assuming this means which frontend. Right now this is just weighted. If a more complex solution is desired, a "Cohort" solution would have to be implemented.
   This will lead a bit more into the 5th question below, but if we wanted to have more specific rules like, all users who are created before the year 2024 get frontend-a, all users who are part of the "beta program" get frontend-b, and everyone else gets the wordpress frontend
   a middleware tool would have to sit in front of these requests (potentially as a cloudflare worker) to possibly set that ab_variant cookie automatically, or some other method for setting which service to display to the user

5. Can you list the pros and cons of your approach?
   
   Pros: This is a basic setup that is rather easy to scale both horizontally and vertically. Weights of where to send the users is easy to update
   and I believe traefik will hot-reload the settings without a deployment if that's desired.

   Cons: This is a basic setup... As soon as you want to do anything more than % weighting of traffic, this won't work anymore. This would ideally be something
   I would have determined as a possibility during the requirement gathering phase of the project. Likely in the real world, this wouldn't be the solution, as in my experience,
   the business side likes having multiple options and broad capabilities when targeting users.

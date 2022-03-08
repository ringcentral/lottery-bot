# Use lottery bot from command

Basic command

```bash
# pick lottery winners

# {cmd}, string, required, command name, could be pick, add, new, create, all the same
# {numberToPick} integer, required, how many winners to pick, at least 1, no more than team member's count
# [id], optional, string, 7 < length < 20, random string only contains only A-Za-z0-9_-, when id set, all winners picked from same batch id, will not pick same member twice. If you wanted to pick winners many batches, and every person can win only once, you should set id.
@LotteryBot {cmd} {numberToPick} [id="xxxxxxx"] [title]
```

Examples:

```bash
# most simple: pick 2 winnners
@LotteryBot pick 2

# with title: super prize winners
@LotteryBot pick 3 super prize winners

# with title and id
@LotteryBot pick 3 id="asdasd234csd" lucky prize winners
```

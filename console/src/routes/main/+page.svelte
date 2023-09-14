<script lang="ts">
	import { Icon, DocumentDuplicate, CodeBracket } from "svelte-hero-icons";
</script>

<div>
	<div
		class="w-full h-[180px] bg-background-secondary dark:bg-background-secondary-dark border-b border-stroke-base dark:border-stroke-base-dark">
		<section class="p-12 flex items-center gap-4">
			<span class="text-body-accent dark:text-body-accent-dark font-semibold text-2xl"
				>My Project Name</span>
			<div
				class="bg-background-accent dark:bg-background-accent-dark flex items-center gap-2 border border-stroke-accent dark:border-stroke-accent-dark rounded-full py-1.5 px-5 text-body-base dark:text-body-base-dark text-sm antialiased">
				<Icon src={DocumentDuplicate} width="15" />
				Project ID
			</div>
		</section>
	</div>
	<div class="w-full">
		<div class="max-w-6xl m-auto mt-10">
			<div
				class="w-full rounded-2xl border border-stroke-base dark:border-stroke-base-dark bg-background-tertiary dark:bg-background-tertiary-dark">
				<section class="p-10 antialiased min-h-[200px]">
					<div class="text-body-accent dark:text-body-accent-dark font-medium text-2xl">
						Getting started
					</div>
					<div class="text-sm text-body-base dark:text-body-base-dark">
						Setup your project like a boss
					</div>
				</section>
				<section
					class="p-10 antialiased min-h-[200px] border-t border-stroke-base dark:border-stroke-base-dark">
					<div class="grid grid-cols-5 gap-10">
						<div class="col-span-2">
							<div
								class="text-body-accent dark:text-body-accent-dark font-medium text-xl">
								Integrate our SDK
							</div>
							<div class="text-sm text-body-base dark:text-body-base-dark">
								Our SDKs let you control your agent frontend with bidirectionnal
								streaming and even more features.
							</div>
						</div>
						<div class="col-span-3 grid grid-cols-2 gap-5">
							<div
								class="antialiased border rounded-xl py-7 px-7 border-stroke-base dark:border-stroke-base-dark flex items-center justify-center gap-3 text-body-base dark:text-body-base-dark hover:bg-background-accent dark:hover:bg-background-accent-dark cursor-pointer">
								<div
									class="rounded-full border border-stroke-base dark:border-stroke-base-dark p-3 bg-background-secondary dark:bg-background-secondary-dark">
									<Icon src={CodeBracket} width="20" class="text-body-subdued" />
								</div>
								<div>NodeJS SDK</div>
							</div>
							<div
								class="antialiased border rounded-xl py-7 px-7 border-stroke-base dark:border-stroke-base-dark flex items-center justify-center gap-3 text-body-base dark:text-body-base-dark hover:bg-background-accent dark:hover:bg-background-accent-dark cursor-pointer">
								<div
									class="rounded-full border border-stroke-base dark:border-stroke-base-dark p-3 bg-background-secondary dark:bg-background-secondary-dark">
									<Icon src={CodeBracket} width="20" class="text-body-subdued" />
								</div>
								<div>Python SDK</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>
</div>

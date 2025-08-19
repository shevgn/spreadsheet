<script lang="ts">
    import ControlPanel from '$lib/components/mainControlPanel/ControlPanel.svelte';
    import Sheet from '$lib/components/sheet/Sheet.svelte';
</script>

<svelte:head>
    <title>Spreadsheet</title>
    <meta
        name="description"
        content="Simple spreadsheet application"
    />
</svelte:head>

<div
    class="flex h-14 w-full items-center bg-white px-2 pt-2 pb-2 md:h-16 md:px-4"
>
    <ControlPanel />
</div>

<div class="h-full w-full max-w-screen overflow-scroll">
    <Sheet />
</div>

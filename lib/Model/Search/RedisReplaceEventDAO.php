<?php

use Search\ReplaceEventStruct;

class Search_RedisReplaceEventDAO extends DataAccess_AbstractDao implements Search_ReplaceEventDAOInterface {

    const TABLE = 'replace_events';

    /**
     * @var \Predis\Client
     */
    private $redis;

    /**
     * Search_RedisReplaceEventDAO constructor.
     *
     * @param null $con
     *
     * @throws ReflectionException
     * @throws \Predis\Connection\ConnectionException
     */
    public function __construct( $con = null ) {
        parent::__construct( $con );

        $this->redis = ( new RedisHandler() )->getConnection();
    }

    /**
     * @param $idJob
     * @param $version
     *
     * @return ReplaceEventStruct[]
     */
    public function getEvents( $idJob, $version ) {
        $results = [];

        foreach ( $this->redis->hgetAll( $this->getRedisKey( $idJob, $version ) ) as $value ) {
            $results[] = unserialize( $value );
        }

        return $results;
    }

    /**
     * @param ReplaceEventStruct $eventStruct
     *
     * @return int
     * @throws ReflectionException
     */
    public function save( ReplaceEventStruct $eventStruct ) {
        // if not directly passed
        // try to assign the current version of the segment if it exists
        if ( null === $eventStruct->segment_version ) {
            $segment                      = ( new Translations_SegmentTranslationDao() )->getByJobId( $eventStruct->id_job )[ 0 ];
            $eventStruct->segment_version = $segment->version_number;
        }

        $eventStruct->created_at = date( 'Y-m-d H:i:s' );

        // insert
        $redisKey = $this->getRedisKey( $eventStruct->id_job, $eventStruct->bulk_version );
        $count    = ( count( $this->getEvents( $eventStruct->id_job, $eventStruct->bulk_version ) ) > 0 ) ? ( count( $this->getEvents( $eventStruct->id_job, $eventStruct->bulk_version ) ) + 1 ) : 0;

        $result = $this->redis->hset( $redisKey, $count, serialize( $eventStruct ) );
        $this->redis->expire( $redisKey, 60 * 60 * 3 ); // 3 hours

        return (true == $result) ? 1 : 0;
    }

    /**
     * @param $idJob
     * @param $version
     *
     * @return string
     */
    private function getRedisKey( $idJob, $version ) {
        return md5( self::TABLE. '::' . $idJob . '::' . $version );
    }
}
